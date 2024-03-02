// lokalden parametre olarak gelen elemanı alır.
export const getStorage = () => {
    // lokalden key ile eşleşen veriyi alma
    const strData = localStorage.getItem('notes')

    // gelen string veriyi js verisine çevir ve döndür
    return JSON.parse(strData) //!return'ün görevi fonksiyonun çağırıldığı yere veriyi göndermek yani
    //!lokal storage'dan veriyi alıp fonksiyonu döndürüyor.
}

// lokale parametre olarak gelen elemanı kaydeder
export const setStorage = (data) => {

    // localStorage verileri yalnızca string olarak tuttuğu için ve kabul etmediği için
    //aşağıdakini de stringe çevirmemiz lazım. 
    const strData = JSON.stringify(data)
// veriyi lokale kaydet
    localStorage.setItem('notes',strData)
}

//İKONLAR
export var userIcon = L.icon({
    iconUrl: '/images/Person.png',
    iconSize: [50, 50],
    popupAnchor: [0, -20],
    shadowUrl: '/images/my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [30, 34],
  });
  
  var homeIcon = L.icon({
    iconUrl: '/images/Home_8.png',
    iconSize: [70, 75],
    popupAnchor: [0, -20],
    shadowUrl: '/images/my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [30, 34],
  });
  
  var jobIcon = L.icon({
    iconUrl: '/images/Briefcase_8.png',
    iconSize: [70, 75],
    popupAnchor: [0, -20],
    shadowUrl: '/images/my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [30, 34],
  });
  
  var gotoIcon = L.icon({
    iconUrl: '/images/Aeroplane_8.png',
    iconSize: [70, 75],
    popupAnchor: [0, -20],
    shadowUrl: '/images/my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [30, 34],
  });
  
  var parkIcon = L.icon({
    iconUrl: '/images/Parking_8.png',
    iconSize: [70, 75],
    popupAnchor: [0, -20],
    shadowUrl: '/images/my-icon-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [30, 34],
  });
  
  //
  export const icons = {
    goto: gotoIcon,
    home: homeIcon,
    job: jobIcon,
    park: parkIcon,
  };
