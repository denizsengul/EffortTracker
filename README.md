# Efor Takip Sistemi

Bu proje, yazılım geliştiricilerin çalışma saatlerini ve yaptıkları işleri takip edebilecekleri, yöneticilerin ise bu kayıtları onaylayıp reddedebilecekleri bir web uygulamasıdır.

## Proje Özellikleri

### Teknik Özellikler

- **Frontend Teknolojileri**: Vanilla JavaScript, HTML5, CSS3 (framework kullanılmadan)
- **Görselleştirme**: Chart.js kütüphanesi ile dashboard grafikleri
- **İkonlar**: Font Awesome CDN üzerinden
- **Mimari**: Modüler sınıf yapısı (auth.js, data.js, app.js, dashboard.js)
- **Veri Yönetimi**: Tarayıcı localStorage kullanılarak taklit edilen veritabanı
- **Responsive Tasarım**: CSS Grid ve Flexbox ile mobil uyumlu arayüz

### Temel Özellikler

1. **Rol Tabanlı Giriş Sistemi**:
   - Developer ve Manager rolleri
   - Farklı rollere göre farklı arayüz ve yetkiler

2. **Geliştirici Özellikleri**:
   - Çalışma kaydı ekleme, düzenleme ve silme
   - Kendi kayıtlarını görüntüleme
   - Dashboard üzerinden çalışma istatistiklerini takip etme

3. **Yönetici Özellikleri**:
   - Tüm geliştirici kayıtlarını görüntüleme
   - Kayıtları onaylama veya reddetme
   - Not ekleme
   - Filtreleme ve arama

4. **Dashboard**:
   - Günlük, haftalık ve aylık çalışma saati istatistikleri
   - Haftalık çalışma saatleri grafiği
   - Kayıt durumu dağılımı grafiği (bekleyen, onaylanan, reddedilen)

5. **Kayıt Yönetimi**:
   - Tarih, açıklama ve saat bilgisi içeren kayıtlar
   - Durum takibi (bekleyen, onaylanan, reddedilen)
   - Yönetici notları

## Kullanıcı Arayüzü

- Modern ve temiz tasarım
- Renk kodlu durum göstergeleri (sarı: bekleyen, yeşil: onaylanan, kırmızı: reddedilen)
- Bildirim sistemi (toast notifications)
- Modal pencereler ile kayıt ekleme/düzenleme
- Responsive tasarım (mobil ve masaüstü uyumlu)

## Sistem Mimarisi

### Frontend Mimarisi
- **Teknoloji Yığını**: Vanilla JavaScript, HTML5, CSS3 (Chart.js dışında kütüphane kullanılmadı)
- **Mimari Desen**: Modüler sınıf yapısı (kimlik doğrulama, veri yönetimi ve dashboard işlevleri için ayrı modüller)
- **Responsive Tasarım**: CSS Grid ve Flexbox ile mobil öncelikli yaklaşım
- **Durum Yönetimi**: JavaScript sınıfları ile istemci tarafında durum yönetimi ve yerel veri depolama simülasyonu

### Kimlik Doğrulama ve Yetkilendirme
- **Giriş Sistemi**: E-posta/şifre kimlik doğrulaması ve rol tabanlı erişim kontrolü
- **Kullanıcı Rolleri**: "developer" ve "manager" olmak üzere iki farklı rol
- **Oturum Yönetimi**: Rol tabanlı gezinme görünürlüğü ile istemci tarafı kullanıcı oturum yönetimi
- **Güvenlik**: Temel istemci tarafı doğrulama (not: bu bir demo sistemidir, gerçek güvenlik önlemleri yoktur)

### Veri Yönetimi
- **Veri Katmanı**: Backend veritabanını simüle eden sahte JSON verileri
- **CRUD İşlemleri**: Zaman girişleri için tam Oluşturma, Okuma, Güncelleme, Silme işlemleri
- **Veri Yapısı**: Kullanıcılar ve durum izleme (bekleyen, onaylanmış, reddedilmiş) ile zaman girişleri için yapılandırılmış veri modelleri
- **Filtreleme ve İstatistikler**: Günlük, haftalık ve aylık istatistikler için yerleşik veri toplama

## Demo Hesaplar

- **Geliştirici**: dev@example.com / password
- **Yönetici**: manager@example.com / password

## Kurulum ve Çalıştırma

1. Projeyi klonlayın:
   ```
   git clone https://github.com/kullaniciadi/EffortTracker.git
   ```

2. Herhangi bir web sunucusu kullanarak projeyi çalıştırın (örneğin, Live Server VSCode eklentisi)

3. Tarayıcınızda açın ve demo hesaplarla giriş yapın

## Gelecek Geliştirmeler

- Gerçek bir backend API'si ile entegrasyon
- Daha gelişmiş filtreleme ve arama özellikleri
- Rapor oluşturma ve dışa aktarma
- Takvim görünümü ekleme
- Proje bazlı efor takibi