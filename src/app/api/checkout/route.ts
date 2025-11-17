import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      addressId,
      products,
      courierId,
      paymentMethod,
      subtotal,
      shippingCost,
      total
    } = body

    // Validasi input
    if (!addressId || !products || !courierId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate order ID
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Simulasi penyimpanan order ke database
    const order = {
      id: orderId,
      addressId,
      products,
      courierId,
      paymentMethod,
      subtotal,
      shippingCost,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Simulasi response sukses
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        paymentUrl: paymentMethod !== 'cod' ? `https://payment.example.com/pay/${orderId}` : null,
        estimatedDelivery: calculateEstimatedDelivery(courierId)
      }
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateEstimatedDelivery(courierId: string): string {
  const deliveryTimes = {
    'jne': '2-3 hari',
    'sicepat': '1-2 hari',
    'jnt': '2-3 hari'
  }
  
  const estimatedDays = deliveryTimes[courierId as keyof typeof deliveryTimes] || '2-3 hari'
  const deliveryDate = new Date()
  
  if (courierId === 'sicepat') {
    deliveryDate.setDate(deliveryDate.getDate() + 1)
  } else {
    deliveryDate.setDate(deliveryDate.getDate() + 2)
  }
  
  return `${estimatedDays} (${deliveryDate.toLocaleDateString('id-ID')})`
}