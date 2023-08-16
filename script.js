'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

let map;
let mapEvent;

class App {

    #map;
    #mapEvent;

    constructor(){

        this._getPosition();
        
        form.addEventListener('submit', this._newWorkout.bind(this));

        inputType.addEventListener('change', () => {
            inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
            inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
        });

    }
    _getPosition(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function(){
                    alert('Cannot get your coordinates');
                }
            )
        }
    }
                    
    _loadMap(position){

            const {latitude} = position.coords;
            const {longitude} = position.coords;

            const coords = [latitude, longitude];
            this.#map = L.map('map').setView(coords, 12);

            L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
                attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
             }).addTo(this.#map);


            this.#map.on('click', (event)=>{
                
                this.#mapEvent = event;
                form.classList.remove('hidden');    
                inputDistance.focus();
 
            });  

    }

    _showForm(){

    }

    _toggleClimbField(){

    }

    _newWorkout(event){
        event.preventDefault();
        

            // Input Field Cleansing
            inputDistance.value =
            inputDuration.value = 
            inputTemp.value = 
            inputClimb.value = '';
        
            // Input clearence
            inputDistance.value = inputDuration.value  = inputTemp.value  = inputClimb.value  = '';
        
            // Marker view
            const {lat, lng} = this.#mapEvent.latlng;
        
    
            L.marker([lat, lng])
                .addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth: 300,
                    minWidth: 50,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup'
                }))
                .setPopupContent('Cardio')
                .openPopup();
    }

}

const app = new App();













