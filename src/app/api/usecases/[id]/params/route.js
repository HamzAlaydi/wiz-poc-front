import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const response = await axios.get(`http://18.199.124.150:2025/api/v1/usecase/${id}/params`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Params API Error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { 
          status: 'ERROR',
          message: `Server error: ${error.response.status}`,
          error: error.response.data 
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      return NextResponse.json(
        { 
          status: 'ERROR',
          message: 'Network error - unable to reach the server',
          error: 'The server is unreachable or there is a network issue'
        },
        { status: 503 }
      );
    } else {
      return NextResponse.json(
        { 
          status: 'ERROR',
          message: 'Internal server error',
          error: error.message 
        },
        { status: 500 }
      );
    }
  }
}

export async function PATCH(request, { params }) {
  const { id } = params;
  
  try {
    const body = await request.json();
    
    // Transform the payload to match the required format
    const payload = {
      paramKey: body.paramKey || "input_text",
      paramValue: body.paramValue
    };
    
    const response = await axios.patch(`http://18.199.124.150:2025/api/v1/usecase/${id}/params`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Update Params API Error:', error);
    
    if (error.response) {
      return NextResponse.json(
        { 
          status: 'ERROR',
          message: `Server error: ${error.response.status}`,
          error: error.response.data 
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      return NextResponse.json(
        { 
          status: 'ERROR',
          message: 'Network error - unable to reach the server',
          error: 'The server is unreachable or there is a network issue'
        },
        { status: 503 }
      );
    } else {
      return NextResponse.json(
        { 
          status: 'ERROR',
          message: 'Internal server error',
          error: error.message 
        },
        { status: 500 }
      );
    }
  }
}
