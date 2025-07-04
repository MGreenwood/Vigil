package services

import (
	"fmt"
	"net/smtp"
	"os"
)

type EmailService struct {
	host     string
	port     string
	username string
	password string
	from     string
}

type EmailData struct {
	To      string
	Subject string
	Body    string
	HTML    string
}

func NewEmailService() *EmailService {
	return &EmailService{
		host:     os.Getenv("SMTP_HOST"),
		port:     os.Getenv("SMTP_PORT"),
		username: os.Getenv("SMTP_USERNAME"),
		password: os.Getenv("SMTP_PASSWORD"),
		from:     os.Getenv("SMTP_FROM"),
	}
}

func (e *EmailService) SendEmail(data EmailData) error {
	// For development with Mailhog, we can send without auth
	if e.host == "mailhog" {
		return e.sendToMailhog(data)
	}

	// For production SMTP servers
	return e.sendToSMTP(data)
}

func (e *EmailService) sendToMailhog(data EmailData) error {
	// Mailhog doesn't require authentication
	auth := smtp.PlainAuth("", "", "", e.host+":"+e.port)

	to := []string{data.To}
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"From: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", data.To, e.from, data.Subject, data.HTML))

	return smtp.SendMail(e.host+":"+e.port, auth, e.from, to, msg)
}

func (e *EmailService) sendToSMTP(data EmailData) error {
	auth := smtp.PlainAuth("", e.username, e.password, e.host)

	to := []string{data.To}
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"From: %s\r\n"+
		"Subject: %s\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", data.To, e.from, data.Subject, data.HTML))

	return smtp.SendMail(e.host+":"+e.port, auth, e.from, to, msg)
}

func (e *EmailService) SendWelcomeEmail(email string, name string) error {
	subject := "Welcome to Vigil - You're on the Interest List!"

	htmlBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background: linear-gradient(135deg, #0C1B33 0%, #1a365d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
				.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
				.button { display: inline-block; background: #FFB300; color: #0C1B33; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
				.footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>👁️ Welcome to Vigil!</h1>
					<p>You're now on our interest list</p>
				</div>
				<div class="content">
					<h2>Hi %s,</h2>
					<p>Thanks for joining the Vigil interest list! We're excited to have you on board.</p>
					
					<h3>What's Next?</h3>
					<ul>
						<li><strong>Early Access:</strong> You'll be among the first to know when Vigil launches</li>
						<li><strong>Exclusive Updates:</strong> Get behind-the-scenes insights into our development</li>
						<li><strong>Special Offers:</strong> Early subscribers will get special pricing</li>
					</ul>
					
					<p>We're building something special - a developer-focused monitoring platform that actually makes sense.</p>
					
					<div style="text-align: center; margin: 30px 0;">
						<a href="https://vigil.rest" class="button">Visit Vigil</a>
					</div>
					
					<p>In the meantime, if you have any questions or suggestions, just reply to this email or contact us at <a href="mailto:support@vigil.rest">support@vigil.rest</a>.</p>
					
					<p>Best regards,<br>The Vigil Team</p>
				</div>
				<div class="footer">
					<p>You're receiving this because you signed up for Vigil updates.<br>
					<a href="mailto:support@vigil.rest">Unsubscribe</a> | <a href="mailto:support@vigil.rest">Contact Support</a></p>
				</div>
			</div>
		</body>
		</html>
	`, name)

	return e.SendEmail(EmailData{
		To:      email,
		Subject: subject,
		HTML:    htmlBody,
	})
}

func (e *EmailService) SendLaunchNotification(email string, name string) error {
	subject := "🚀 Vigil is Live! Your Early Access is Ready"

	htmlBody := fmt.Sprintf(`
		<!DOCTYPE html>
		<html>
		<head>
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background: linear-gradient(135deg, #0C1B33 0%, #1a365d 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
				.content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
				.button { display: inline-block; background: #FFB300; color: #0C1B33; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
				.footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>🚀 Vigil is Live!</h1>
					<p>Your early access is ready</p>
				</div>
				<div class="content">
					<h2>Hi %s,</h2>
					<p>Great news! Vigil is now live and ready for you to start monitoring your services.</p>
					
					<h3>What You Get:</h3>
					<ul>
						<li><strong>Early Access Pricing:</strong> Special rates for our interest list subscribers</li>
						<li><strong>Full Feature Access:</strong> HTTP, SSL, and webhook monitoring</li>
						<li><strong>Instant Alerts:</strong> Slack, Discord, and email notifications</li>
						<li><strong>Developer-Friendly API:</strong> Easy integration with your existing tools</li>
					</ul>
					
					<div style="text-align: center; margin: 30px 0;">
						<a href="https://vigil.rest/dashboard" class="button">Get Started Now</a>
					</div>
					
					<p>Thanks for being part of our journey. We can't wait to see what you build with Vigil!</p>
					
					<p>Best regards,<br>The Vigil Team</p>
				</div>
				<div class="footer">
					<p>Questions? Contact us at <a href="mailto:support@vigil.rest">support@vigil.rest</a></p>
				</div>
			</div>
		</body>
		</html>
	`, name)

	return e.SendEmail(EmailData{
		To:      email,
		Subject: subject,
		HTML:    htmlBody,
	})
}
