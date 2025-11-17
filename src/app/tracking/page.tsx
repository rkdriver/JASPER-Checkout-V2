'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Truck, Package, Clock, CheckCircle, Search, ArrowLeft, MapPin, Phone, User, Calendar, FileText } from 'lucide-react'
import TrackingMap from '@/components/TrackingMap'
import 'leaflet/dist/leaflet.css'

interface OrderData {
  id: string
  status: string
  createdAt: string
  updatedAt: string
  subtotal: number
  shippingCost: number
  total: number
  paymentMethod: string
  courier: {
    id: string
    name: string
    trackingNumber: string
  }
  address: {
    name: string
    phone: string
    address: string
  }
  products: Array<{
    id: string
    name: string
    price: number
    quantity: number
    variant: string
  }>
}

interface StatusHistory {
  id: number
  status: string
  time: string
  description: string
  completed: boolean
  icon: string
  trackingNumber?: string
}

export default function TrackingPage() {
  const searchParams = useSearchParams()
  const [searchOrderId, setSearchOrderId] = useState('')
  const [currentOrderId, setCurrentOrderId] = useState(searchParams.get('orderId') || 'ORD123456789')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const getTrackingLocations = (status: string, address: string) => {
    // Default locations for Jakarta area
    const jakartaLocations = {
      warehouse: { lat: -6.1395, lng: 106.8135 }, // Jakarta Pusat
      transit: { lat: -6.2088, lng: 106.8456 }, // Jakarta Selatan
      destination: { lat: -6.3021, lng: 106.8959 } // Jakarta Barat
    }

    if (status === 'processing') {
      return {
        current: jakartaLocations.warehouse,
        destination: jakartaLocations.transit,
        distance: '5.2 km',
        estimatedTime: '2-3 jam'
      }
    } else if (status === 'shipped') {
      return {
        current: jakartaLocations.transit,
        destination: jakartaLocations.destination,
        distance: '8.7 km',
        estimatedTime: '1-2 jam'
      }
    } else {
      return {
        current: jakartaLocations.destination,
        destination: jakartaLocations.destination,
        distance: '0 km',
        estimatedTime: 'Sampai'
      }
    }
  }

  const locations = orderData ? getTrackingLocations(orderData.status, orderData.address.address) : 
    { 
      current: { lat: -6.2088, lng: 106.8456 }, 
      destination: { lat: -6.2297, lng: 106.8295 },
      distance: '2.5 km',
      estimatedTime: '30 menit'
    }

  const iconMap: { [key: string]: any } = {
    'clock': Clock,
    'check-circle': CheckCircle,
    'package': Package,
    'truck': Truck
  }

  useEffect(() => {
    fetchOrderStatus(currentOrderId)
  }, [])

  const fetchOrderStatus = async (orderId: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/order/status?orderId=${orderId}`)
      const result = await response.json()
      
      if (result.success) {
        setOrderData(result.data.order)
        setStatusHistory(result.data.statusHistory)
      } else {
        setError('Order tidak ditemukan')
      }
    } catch (error) {
      console.error('Fetch order status error:', error)
      setError('Terjadi kesalahan saat mengambil data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchOrderId.trim()) {
      setCurrentOrderId(searchOrderId.trim())
      fetchOrderStatus(searchOrderId.trim())
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Pembayaran'
      case 'paid': return 'Pembayaran Berhasil'
      case 'processing': return 'Sedang Diproses'
      case 'shipped': return 'Dikirim'
      case 'delivered': return 'Sampai Tujuan'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#242a2e] text-white">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 p-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Lacak Status Barang</h1>
              <p className="text-sm text-gray-300 mt-1">Cek status pengiriman pesanan Anda</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Search Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                placeholder="Masukkan Nomor Order (contoh: ORD123456789)"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-[#242a2e] hover:bg-[#1a1f22]"
              >
                <Search className="w-4 h-4 mr-2" />
                Cari
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#242a2e]"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Tidak Ditemukan</h3>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        ) : orderData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">Informasi Pesanan</h2>
                      <p className="text-sm text-gray-600">Order ID: {orderData.id}</p>
                    </div>
                    <Badge className={getStatusColor(orderData.status)}>
                      {getStatusText(orderData.status)}
                    </Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tanggal Pesanan</p>
                      <p className="font-medium">{new Date(orderData.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Metode Pembayaran</p>
                      <p className="font-medium capitalize">{orderData.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Kurir</p>
                      <p className="font-medium">{orderData.courier.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">No. Resi</p>
                      <p className="font-medium">{orderData.courier.trackingNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-6">Status Pengiriman</h2>
                  <div className="space-y-6">
                    {statusHistory.map((item, index) => {
                      const Icon = iconMap[item.icon] || Package
                      return (
                        <div key={item.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            {index < statusHistory.length - 1 && (
                              <div className={`w-0.5 h-16 mt-2 ${
                                item.completed ? 'bg-green-300' : 'bg-gray-200'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${
                                item.completed ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {item.status}
                              </h3>
                              {item.completed && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.time}</p>
                            {item.description && (
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {item.description}
                              </p>
                            )}
                            {item.trackingNumber && (
                              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <strong>Nomor Resi:</strong> {item.trackingNumber}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Map */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#242a2e]" />
                    Lokasi Pengiriman
                  </h2>
                  <div className="space-y-4">
                    <TrackingMap 
                      currentPosition={locations.current}
                      destinationPosition={locations.destination}
                      status={orderData.status}
                    />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#242a2e] rounded-full"></div>
                        <span className="text-gray-600">
                          {orderData.status === 'shipped' ? 'Lokasi Saat Ini' : 
                           orderData.status === 'delivered' ? 'Lokasi Tujuan' : 'Lokasi Awal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Alamat Tujuan</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
                      <div>
                        <p className="text-gray-600">Jarak</p>
                        <p className="font-semibold text-[#242a2e]">{locations.distance}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estimasi</p>
                        <p className="font-semibold text-[#242a2e]">{locations.estimatedTime}</p>
                      </div>
                    </div>
                    {orderData.status === 'shipped' && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Status:</strong> Paket sedang dalam perjalanan ke alamat tujuan
                        </p>
                      </div>
                    )}
                    {orderData.status === 'delivered' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Status:</strong> Paket telah sampai di alamat tujuan
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Detail Produk</h2>
                  <div className="space-y-4">
                    {orderData.products.map((product) => (
                      <div key={product.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-[#242a2e] rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.variant}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                            <p className="font-semibold">
                              Rp {(product.price * product.quantity).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#242a2e]" />
                    Alamat Pengiriman
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{orderData.address.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p>{orderData.address.phone}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{orderData.address.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#242a2e]" />
                    Ringkasan Pembayaran
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>Rp {orderData.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Biaya Pengiriman</span>
                      <span>Rp {orderData.shippingCost.toLocaleString('id-ID')}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Pembayaran</span>
                      <span className="text-[#242a2e]">Rp {orderData.total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-[#242a2e] hover:bg-[#1a1f22]"
                      onClick={() => window.print()}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Cetak Detail Pesanan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#242a2e] text-[#242a2e] hover:bg-[#242a2e] hover:text-white"
                      onClick={() => window.history.back()}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali ke Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}