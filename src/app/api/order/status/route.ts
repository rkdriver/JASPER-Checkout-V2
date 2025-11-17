import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Simulasi data status order
    const orderStatus = [
      {
        id: 1,
        status: 'Menunggu Pembayaran',
        time: '2024-01-15 10:30',
        description: 'Menunggu konfirmasi pembayaran dari pembeli',
        completed: true,
        icon: 'clock'
      },
      {
        id: 2,
        status: 'Pembayaran Berhasil',
        time: '2024-01-15 11:45',
        description: 'Pembayaran telah dikonfirmasi',
        completed: true,
        icon: 'check-circle'
      },
      {
        id: 3,
        status: 'Sedang Diproses',
        time: '2024-01-15 14:20',
        description: 'Pesanan sedang disiapkan oleh penjual',
        completed: true,
        icon: 'package'
      },
      {
        id: 4,
        status: 'Dikirim',
        time: '2024-01-16 09:15',
        description: `Pesanan telah dikirim dengan resi JNE1234567890`,
        completed: true,
        icon: 'truck',
        trackingNumber: 'JNE1234567890'
      },
      {
        id: 5,
        status: 'Sampai Tujuan',
        time: 'Estimasi: 2024-01-17',
        description: 'Pesanan sedang dalam perjalanan ke alamat tujuan',
        completed: false,
        icon: 'check-circle'
      }
    ]

    // Simulasi data order
    const order = {
      id: orderId,
      status: 'shipped',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T09:15:00Z',
      subtotal: 50000,
      shippingCost: 15000,
      total: 65000,
      paymentMethod: 'transfer',
      courier: {
        id: 'jne',
        name: 'JNE Express',
        trackingNumber: 'JNE1234567890'
      },
      address: {
        name: 'Bahlil',
        phone: '0812-3456-7890',
        address: 'Jl. Sudirman No. 123, RT 001/RW 002, Kel. Senayan, Kec. Kebayoran Baru, Jakarta Selatan, DKI Jakarta, 12190'
      },
      products: [
        {
          id: '1',
          name: 'Jasa Service Laptop & PC',
          price: 50000,
          quantity: 1,
          variant: 'Jasa Service Laptop'
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: {
        order,
        statusHistory: orderStatus
      }
    })

  } catch (error) {
    console.error('Order status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}