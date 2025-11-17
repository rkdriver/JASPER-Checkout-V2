'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MapPin, Truck, Shield, CreditCard, ChevronRight, Plus, Edit2, Package, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState('1')
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [selectedCourier, setSelectedCourier] = useState('jne')
  const [isLoading, setIsLoading] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)

  const addresses = [
    {
      id: '1',
      name: 'John Doe',
      phone: '0812-3456-7890',
      address: 'Jl. Sudirman No. 123, RT 001/RW 002, Kel. Senayan, Kec. Kebayoran Baru, Jakarta Selatan, DKI Jakarta, 12190',
      isDefault: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '0856-9876-5432',
      address: 'Jl. Thamrin No. 456, RT 003/RW 004, Kel. Menteng, Kec. Menteng, Jakarta Pusat, DKI Jakarta, 10310',
      isDefault: false
    }
  ]

  const products = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 256GB Natural Titanium',
      price: 24999000,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80/242a2e/ffffff?text=iPhone',
      shopName: 'Apple Official Store',
      variant: '256GB, Natural Titanium'
    },
    {
      id: '2',
      name: 'AirPods Pro 2nd Generation with MagSafe Case',
      price: 3299000,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80/242a2e/ffffff?text=AirPods',
      shopName: 'Apple Official Store',
      variant: 'White'
    }
  ]

  const couriers = [
    { id: 'jne', name: 'JNE Express', price: 15000, estimated: '2-3 hari' },
    { id: 'sicepat', name: 'SiCepat Express', price: 12000, estimated: '1-2 hari' },
    { id: 'jnt', name: 'J&T Express', price: 13000, estimated: '2-3 hari' }
  ]

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery (COD)', icon: Truck },
    { id: 'transfer', name: 'Transfer Bank', icon: CreditCard },
    { id: 'ewallet', name: 'E-Wallet', icon: CreditCard }
  ]

  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
  const shippingCost = couriers.find(c => c.id === selectedCourier)?.price || 0
  const total = subtotal + shippingCost

  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId: selectedAddress,
          products,
          courierId: selectedCourier,
          paymentMethod: selectedPayment,
          subtotal,
          shippingCost,
          total
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`Pesanan berhasil dibuat! Order ID: ${result.data.order.id}`)
        // Redirect ke halaman tracking
        window.location.href = `/tracking?orderId=${result.data.order.id}`
      } else {
        alert('Gagal membuat pesanan: ' + result.error)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Terjadi kesalahan saat membuat pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#242a2e] text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl font-semibold">Checkout</h1>
          <p className="text-sm text-gray-300 mt-1">Lengkapi detail pesanan Anda</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alamat Pengiriman */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#242a2e] text-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <h2 className="font-semibold">Alamat Pengiriman</h2>
                    </div>
                    <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Plus className="w-4 h-4 mr-1" />
                          Tambah Alamat
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tambah Alamat Baru</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" placeholder="Masukkan nama lengkap" />
                          </div>
                          <div>
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input id="phone" placeholder="Masukkan nomor telepon" />
                          </div>
                          <div>
                            <Label htmlFor="address">Alamat Lengkap</Label>
                            <Input id="address" placeholder="Masukkan alamat lengkap" />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setShowAddAddress(false)}
                              className="flex-1"
                            >
                              Batal
                            </Button>
                            <Button 
                              className="flex-1 bg-[#242a2e] hover:bg-[#1a1f22]"
                              onClick={() => setShowAddAddress(false)}
                            >
                              Simpan
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {addresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Label htmlFor={address.id} className="font-medium cursor-pointer">
                                {address.name}
                              </Label>
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">Utama</Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                          <p className="text-sm text-gray-700 mt-1">{address.address}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Produk */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#242a2e] text-white p-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <h2 className="font-semibold">Detail Produk</h2>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{product.shopName}</p>
                        <h3 className="font-medium mt-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.variant}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                          </div>
                          <p className="font-semibold text-[#242a2e]">
                            Rp {(product.price * product.quantity).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pengiriman */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#242a2e] text-white p-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    <h2 className="font-semibold">Metode Pengiriman</h2>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <RadioGroup value={selectedCourier} onValueChange={setSelectedCourier}>
                    {couriers.map((courier) => (
                      <div key={courier.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={courier.id} id={courier.id} />
                          <div>
                            <Label htmlFor={courier.id} className="font-medium cursor-pointer">
                              {courier.name}
                            </Label>
                            <p className="text-sm text-gray-600">Estimasi {courier.estimated}</p>
                          </div>
                        </div>
                        <p className="font-semibold">Rp {courier.price.toLocaleString('id-ID')}</p>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Voucher */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#242a2e] text-white p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <h2 className="font-semibold">Voucher & Promo</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Masukkan kode voucher" 
                      className="flex-1"
                    />
                    <Button variant="outline" className="border-[#242a2e] text-[#242a2e] hover:bg-[#242a2e] hover:text-white">
                      Pakai
                    </Button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="p-3 border border-dashed border-gray-300 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">DISKON10</p>
                          <p className="text-xs text-gray-600">Diskon 10% max Rp 50.000</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Ambil
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pembayaran */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#242a2e] text-white p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <h2 className="font-semibold">Metode Pembayaran</h2>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Icon className="w-5 h-5 text-[#242a2e]" />
                            <Label htmlFor={method.id} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Asuransi */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#242a2e] text-white p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <h2 className="font-semibold">Asuransi Pengiriman</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <Label className="font-medium cursor-pointer">Asuransi Barang</Label>
                        <p className="text-sm text-gray-600">Lindungi barang Anda dari kerusakan</p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">Rp 2.000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catatan Pembeli */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#242a2e] text-white p-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <h2 className="font-semibold">Catatan untuk Penjual</h2>
                  </div>
                </div>
                <div className="p-4">
                  <Input 
                    placeholder="Contoh: warna biru, ukuran XL, dll" 
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ringkasan Belanja */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Ringkasan Belanja</h2>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({products.length} produk)</span>
                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Biaya Pengiriman</span>
                    <span>Rp {shippingCost.toLocaleString('id-ID')}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-[#242a2e]">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-[#242a2e] text-[#242a2e] hover:bg-[#242a2e] hover:text-white"
                    onClick={() => window.location.href = '/tracking'}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Lihat Status Barang
                  </Button>

                  <Button 
                    className="w-full bg-[#242a2e] hover:bg-[#1a1f22] text-white"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Buat Pesanan
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Pembayaran aman dan terenkripsi
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}