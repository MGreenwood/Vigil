-- Vigil Database Initialization Script

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monitors_organization_id ON monitors(organization_id);
CREATE INDEX IF NOT EXISTS idx_monitor_checks_monitor_id ON monitor_checks(monitor_id);
CREATE INDEX IF NOT EXISTS idx_monitor_checks_checked_at ON monitor_checks(checked_at);
CREATE INDEX IF NOT EXISTS idx_alerts_monitor_id ON alerts(monitor_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered_at ON webhook_deliveries(delivered_at);

-- Create a function to calculate uptime percentage
CREATE OR REPLACE FUNCTION calculate_uptime(
    monitor_id_param INTEGER,
    days_back INTEGER DEFAULT 30
)
RETURNS DECIMAL AS $$
DECLARE
    total_checks INTEGER;
    successful_checks INTEGER;
    uptime_percentage DECIMAL;
BEGIN
    -- Count total checks in the last N days
    SELECT COUNT(*) INTO total_checks
    FROM monitor_checks
    WHERE monitor_id = monitor_id_param
    AND checked_at >= NOW() - INTERVAL '1 day' * days_back;
    
    -- Count successful checks
    SELECT COUNT(*) INTO successful_checks
    FROM monitor_checks
    WHERE monitor_id = monitor_id_param
    AND status = 'up'
    AND checked_at >= NOW() - INTERVAL '1 day' * days_back;
    
    -- Calculate percentage
    IF total_checks > 0 THEN
        uptime_percentage := (successful_checks::DECIMAL / total_checks::DECIMAL) * 100;
    ELSE
        uptime_percentage := 0;
    END IF;
    
    RETURN ROUND(uptime_percentage, 2);
END;
$$ LANGUAGE plpgsql;

-- Create a function to get average response time
CREATE OR REPLACE FUNCTION get_avg_response_time(
    monitor_id_param INTEGER,
    days_back INTEGER DEFAULT 7
)
RETURNS INTEGER AS $$
DECLARE
    avg_time INTEGER;
BEGIN
    SELECT COALESCE(AVG(response_time), 0) INTO avg_time
    FROM monitor_checks
    WHERE monitor_id = monitor_id_param
    AND checked_at >= NOW() - INTERVAL '1 day' * days_back
    AND status = 'up';
    
    RETURN avg_time;
END;
$$ LANGUAGE plpgsql;

-- Create a view for monitor statistics
CREATE OR REPLACE VIEW monitor_stats AS
SELECT 
    m.id,
    m.name,
    m.type,
    m.url,
    m.is_active,
    m.organization_id,
    calculate_uptime(m.id, 30) as uptime_30d,
    calculate_uptime(m.id, 7) as uptime_7d,
    calculate_uptime(m.id, 1) as uptime_24h,
    get_avg_response_time(m.id, 7) as avg_response_time_7d,
    (SELECT COUNT(*) FROM monitor_checks mc WHERE mc.monitor_id = m.id AND mc.status = 'down' AND mc.checked_at >= NOW() - INTERVAL '24 hours') as failures_24h,
    (SELECT COUNT(*) FROM alerts a WHERE a.monitor_id = m.id AND a.resolved_at IS NULL) as active_alerts,
    m.created_at,
    m.updated_at
FROM monitors m;

-- Create a view for organization statistics
CREATE OR REPLACE VIEW organization_stats AS
SELECT 
    o.id,
    o.name,
    COUNT(m.id) as total_monitors,
    COUNT(CASE WHEN m.is_active = true THEN 1 END) as active_monitors,
    COUNT(CASE WHEN m.is_active = false THEN 1 END) as inactive_monitors,
    AVG(ms.uptime_30d) as avg_uptime_30d,
    AVG(ms.avg_response_time_7d) as avg_response_time_7d,
    COUNT(DISTINCT a.id) as total_alerts,
    COUNT(DISTINCT CASE WHEN a.resolved_at IS NULL THEN a.id END) as active_alerts,
    o.created_at
FROM organizations o
LEFT JOIN monitors m ON m.organization_id = o.id
LEFT JOIN monitor_stats ms ON ms.id = m.id
LEFT JOIN alerts a ON a.monitor_id = m.id
GROUP BY o.id, o.name, o.created_at; 