//! farklı dosyalardan gelen veriler
// altta helpers.js dosyasından import etmiş olduk. 
import { 
    setStorage,
    getStorage,
    icons, 
    userIcon,
 } from "./helpers.js";


//!html elemanlarını çağırma
const form = document.querySelector('form')
const noteList = document.querySelector('ul')

//! global değişkenler (kodun her yerinden erişilebilen), eğer aşağıda const değişkeniyle
//! coords'u çağırsaydım kendi kapsama alanı dışına çıkmayacağı için globalde çağırmamız gerek.
var map
var coords
var notes = getStorage() || [] //veriler null yerine boş dizi olsun
var markerLayer = null

// console.log(notes) || [] // aradaki OR yani || kullanmasaydık console'da veri null olarak geliyordu ama
//şimdi null yerine boş dizi olsun demiş oluyoruz. 


// var map = L.map('map').setView([51.505, -0.09], 13); /*L harfi leaflet kütüphanesinden gelen 
// bir fonksiyon olduğunu tanımlıyor. O rakamlar da direkt Londra'nın merkezine götüren koordinatlar. 
// 13 sayısı zoom oranı ve o rakamı küçülttükçe zoom out yapıyor. */


//! haritayı ekrana basan fonksiyon - aslında bu direkt siteden aldığımız kodları yukarıda da kullansak çalışıyor ama
//! function içine aldığımız zaman kullanıcının konumunu alabilmek ve o konuma göre haritayı ekrana basabilmek.  
function loadMap(coords){
    map = L.map('map').setView(coords, 13); /*L harfi leaflet kütüphanesinden gelen 
bir fonksiyon olduğunu tanımlıyor. O rakamlar da direkt Londra'nın merkezine götüren koordinatlar. 
13 sayısı zoom oranı ve o rakamı küçülttükçe zoom out yapıyor. */

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// imleçleri tutacağımız ayrı bir katman oluşturma
markerLayer = L.layerGroup().addTo(map)

//kullanıcının konumuna imleç bas
L.marker(coords, {icon: userIcon}).addTo(map)

//? lokalden gelen verileri ekrana bas
renderNoteList(notes)

//haritadaki tıklanma olaylarını izle- burada addEventListener kullanmayıp, onMApClick kullanmamızın sebebi,
//addEventListener'ın tıkladığımız yerin koordinatlarını vermeyecek olması. O yüzden harita kütüphanesinin gösterdiği
//yöntem olan onMapClick'i kullanıyoruz ki tıkladığımız alanın koordinatlarına erişelim. 
map.on('click', onMapClick)
}

//iptal butonuna tıklanırsa formu temizle ve kapat
form[3].addEventListener('click', () =>{
    //formu temizle
form.reset() //yalnızca form öğesinde bulunuyor bu metod ve formdaki inputları sıfırlıyor, temizliyor. 

      //formu kapat
      form.style.display = "none"
})

/* form gönderilirse yeni bir not oluştur ve storage'a kaydet. */
form.addEventListener('submit', (e) =>{
    //sayfanın yenilemesini engelle
    /*sayfanın yenilenmesi demek projemizin o noktada durması ve sırfırlanması demek oluyor 
    //ve eğer engellemezsek, diğer kodlar çalışmayacak. */
    e.preventDefault()

    // 2) inputlardaki verilerden bir note objesi oluştur.
    //e.target demek eventin içerisindeki target bize formu veriyor.

   const newNote ={
    id: new Date().getTime(), //bilgisayarın da tarihini alıp yeni bir tarih oluşturuyor.
    title: form[0].value,
    date: form [1].value,
    status: form[2].value,
    coords: coords, //kullanıcının haritada tıkladığı yerin koordinatları olması lazım. 
   }
    
   // 3) dizinin başına yeni notu ekle ve bunu da unshift'le yapıyoruz.
    notes.unshift(newNote)

    // 4) şimdi notları listeleyeceğiz yani ekrana basıcaz
   renderNoteList(notes)

    // 5) bu aşamada local storage'ı güncelleyeceğiz
    //? burada inspect'i açıp application kısmından sol sekmede local storage'ı açtığında
    //? key'in altında 'notes' olarak geldiğini ve notes'un belirdiğini göreceksin.
   setStorage(notes)

    // 6) bu aşamada da formu kapatacağız. 
    form.style.display = 'none'
    form.reset()
})

//? not için imleç katmanına yeni bir imleç ekler
function renderMarker(note) { 
    // console.log(markerLayer)
    //imleç oluştur
    L.marker(note.coords, {icon: icons[note.status]})
    // imleci katmana ekle
    .addTo(markerLayer)
    // bindPopup(note.title)

}

//* ekrana notları basar
function renderNoteList(items){
// önceden eklenen elemanları temizle
    noteList.innerHTML = ''
    markerLayer.clearLayers()

    // dizideki her bir obje için note kartı bas
    items.forEach((note) =>{
        // li(liste) elemanı oluştur
        const listEle = document.createElement('li')

        //data-id ekle
        listEle.dataset.id = note.id

        //içeriğini belirle
        listEle.innerHTML = `
                <div class="info">
        <p>${note.title}</p>
        <p>
            <span>Tarih:</span>
            <span>${note.date}</span>
        </p>
        <p>
            <span>Durum:</span>
            <span>${note.status}</span>
        </p>
    </div>
    <div class="icons">
        <i id="fly" class="bi bi-airplane-fill"></i>
        <i id="delete" class="bi bi-trash3-fill"></i>
    </div> 
        `

        // elemanı listeye ekle 
        noteList.appendChild(listEle)

        // elemanı haritaya ekle
        renderMarker(note)
    })
}

// kullanıcının konumunu alma
//!callback: bir fonksiyon içersinde belli durumlarda çağırdığımız diğer fonksiyonlar
navigator.geolocation.getCurrentPosition(
    //konumu alırsa çalışacak olan fonksiyon - konumu alırsa kullanıcının konumuna göre yükler
    (e) => {
        loadMap([e.coords.latitude, e.coords.longitude]) //burası benim konumum
    },
    //konumu alamazsa çalışacak fonksiyon - varsayılan olarak Ankara'nın enlem ve boylamını aldığımız için orda başlatır.
    () => {
        loadMap([39.9518536,32.683793]) //Ankara'nın enlem ve boylamı
    }
)

/* haritadaki tıklanma olaylarında çalışır */
function onMapClick(event){ //e= event

    //?tıklanan yerin konumuna eriş, global değişkene aktardım ama let kullanmıyoruz çünkü
    //?zaten yukarda let ile tanımladık o yüzden tekrar let'e gerek yok. 
    coords = [event.latlng.lat, event.latlng.lng] /*burda console'a sadece event.latlng yazdırdığımızda,
    ve haritada bir noktaya tıkladığımızda bize lat ve long değerlerini object olarak veriyor. Ama ayrı ayrı köşeli parantez içinde 
    çağırdığımda o zaman bu değerleri konsolda array yani dizi olarak veriyor. */

      //formu göster
    form.style.display = 'flex' //en yukarda querySelectorla formu çağırdığık ve burda formun içindeki kutucuklu
    //kısmı böyle çağırınca, haritanın üzerinden herhangi bir noktaya tıkladığımızda o notlar kısmındaki kutucukları gösteriyor.

      //ilk inputa odaklar, yani haritada bir yere bastığında Notlar kısmının ilk kutucuğu yani ilk inputu seçili geliyor.
    form[0].focus() //bu konsolda çıkan sıfırıncı eleman
}

//silme uçuş
noteList.addEventListener('click',(e) =>{

    //tıklanılan elemanın id'sine erişme
    // const found_id = e.target.closest('li').dataset.id

    if (e.target.id === 'delete' && 
    confirm("Silme işlemini onaylıyor musunuz?")){
// id'sini bildiğimiz elemanı diziden çıkart
notes = notes.filter((note) => note.id != found_id)

        //localStorage'ı güncelle
        setStorage(notes)

        //ekranı güncelle
        renderNoteList(notes)

        //console.log(found_id)
    }
    if (e.target.id === 'fly'){
        // id'sini bildiğimiz elemanın dizideki haline erişme
        const note = notes.find((note) => note.id == found_id)

        // not'un koordinatlarına git
        map.flyTo(note.coords)
    }
})

  