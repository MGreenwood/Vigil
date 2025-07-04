import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.email || !body.name) {
      return NextResponse.json(
        { success: false, message: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Call the backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'
    const response = await fetch(`${backendUrl}/api/interest/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to sign up' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Interest signup error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 