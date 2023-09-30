'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');


class Workout{

    date = new Date();
    id = (Date.now() + '').slice(-18);

    constructor(coords, distance, duration){
        this.coords = coords;
        this.distance = distance; // km
        this.duration = duration; // min 
    }
}

class Running extends Workout{

    constructor(coords, distance, duration, temp){
        super(coords, distance, duration);
        this.temp = temp;
        this.calculatePace();
    }

    calculatePace(){
        // pace = min / km
        this.pace = this.duration / this.distance;
    }
}


class Cycling extends Workout{

    constructor(coords, distance, duration, climb){
        super(coords, distance, duration);
        this.climb = climb;
        this.calculateSpeed();
    }

    calculateSpeed(){
        
        this.speed = this.distance / (this.duration /  60);
    }
}

const running = new Running([50, 50], 6, 40, 150);
const cycling = new Cycling([50, 50], 40, 80, 340);
console.log(running, cycling);


class App {

    #map;
    #mapEvent;

    constructor(){

        this._getPosition();
        
        form.addEventListener('submit', this._newWorkout.bind(this));

        inputType.addEventListener('change', this._toggleClimbField.bind(this));

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


            this.#map.on('click', this._showForm.bind(this));  

    }

    _showForm(event){
        this.#mapEvent = event;
                form.classList.remove('hidden');    
                inputDistance.focus();

    }

    _toggleClimbField(){
        inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
        inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(event){
        event.preventDefault();
        
            // Getting Training Data 

            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value;

            // Check type of training

            if (type === 'running'){
                const temp = +inputTemp.value;
                if(!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(temp)){
                    return alert('Input number');
                }
            }

            if (type === 'cycling'){
                const climb = +inputClimb.value;
                if(!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(climb)){
                    return alert('Input number');
                }
            }

            // Show Ttaining on Map

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

            // Input Field Cleansing
            inputDistance.value =
            inputDuration.value = 
            inputTemp.value = 
            inputClimb.value = '';
        
            // Input clearence
            inputDistance.value = inputDuration.value  = inputTemp.value  = inputClimb.value  = '';
        
            
            }

}

const app = new App();













