'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--temp');
const inputElevation = document.querySelector('.form__input--climb');

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        function(position){
            const {latitude} = position.coords;
            const {longitude} = position.coords;
            console.log(latitude, longitude);
            console.log(`https://www.google.com/maps/@${latitude},${longitude},12z`);

            const coords = [latitude, longitude];

            const map = L.map('map').setView(coords, 12);

            L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
             }).addTo(map);


            map.on('click', (mapEvent)=>{
                //console.log(mapEvent);
                const {lat, lng} = mapEvent.latlng;


                L.marker([lat, lng])
                .addTo(map)
                .bindPopup(L.popup({
                    maxWidth: 300,
                    minWidth: 50,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup'
                }))
                .setPopupContent('String')
                .openPopup();
            });  


    },
        function(){
            alert('Cannot get your coordinates');
        }
    );
}









