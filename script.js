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

    _setDescription(){

        this.type === 'running' ? this.description = `Пробежка ${Date()}` : this.description = `Велотренировка ${Date()}`
    }
}

class Running extends Workout{

    type = 'running';

    constructor(coords, distance, duration, temp){
        super(coords, distance, duration);
        this.temp = temp;
        this.calculatePace();
        this._setDescription()
    }

    calculatePace(){
        // pace = min / km
        this.pace = this.duration / this.distance;
    }
}


class Cycling extends Workout{

    type = 'cycling';

    constructor(coords, distance, duration, climb){
        super(coords, distance, duration);
        this.climb = climb;
        this.calculateSpeed();
        this._setDescription()
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
    #workouts = [];

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

        const areNumbers = (...numbers) => numbers.every(num => Number.isFinite(num))
        /*
        const areNumbers = (...numbers) => {
            return numbers.every((num) => {
                return Number.isFinite(num)
            })
        }
        */

        const areNumbersPositive = (...numbers) => numbers.every(num => num > 0);

        const {lat, lng} = this.#mapEvent.latlng;
        let workout;
        
        event.preventDefault();
        
            // Getting Training Data 

            const type = inputType.value;
            const distance = +inputDistance.value;
            const duration = +inputDuration.value;

            // Check type of training

            if (type === 'running'){
                const temp = +inputTemp.value;
                if(
                    !areNumbers(distance, duration, temp) || !areNumbersPositive(distance, duration, temp)
                //    !Number.isFinite(distance) || 
                //    !Number.isFinite(duration) || 
                //    !Number.isFinite(temp)
                ){
                    return alert('Input positive number');
                }

                 workout = new Running([lat, lng], distance, duration, temp);
                
            }

            if (type === 'cycling'){
                const climb = +inputClimb.value;
                if(!areNumbers(distance, duration, climb) || !areNumbersPositive(distance, duration)){
                    return alert('Input positive number');
                }

                 workout = new Cycling([lat, lng], distance, duration, climb);
        
            }

            // Add new training object in array
            this.#workouts.push(workout);
            console.log(workout);

            // Show Training on Map
        
            this._displayWorkout(workout);

            // Show training list 

            this._displayWorkoutOnSidebar(workout);

            // Input Field Cleansing
            inputDistance.value =
            inputDuration.value = 
            inputTemp.value = 
            inputClimb.value = '';
        
            // Input clearence
            inputDistance.value = inputDuration.value  = inputTemp.value  = inputClimb.value  = '';
            }

            
            _displayWorkout(workout){
                L.marker(workout.coords)
                .addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth: 300,
                    minWidth: 50,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type}-popup`
                }))
                .setPopupContent('Cardio')
                .openPopup();
            }

            _displayWorkoutOnSidebar(workout){

                let html = `
                <li class="workout workout--${workout.type}" data-id="${workout.id}">
                    <h2 class="workout__title">${workout.description}</h2>
                    <div class="workout__details">
                        <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚵‍♂️'}</span>
                        <span class="workout__value">${workout.distance}</span>
                        <span class="workout__unit">км</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${workout.duration}</span>
                        <span class="workout__unit">мин</span>
                    </div>
                    `

                    if(workout.type === 'running'){
                        html += `
                        <div class="workout__details">
                            <span class="workout__icon">📏⏱</span>
                            <span class="workout__value">${workout.pace}</span>
                            <span class="workout__unit">мин/км</span>
                        </div>
                        <div class="workout__details">
                            <span class="workout__icon">👟⏱</span>
                            <span class="workout__value">${workout.temp}</span>
                            <span class="workout__unit">шаг/мин</span>
                        </div>
                      </li>
                        `
                    }


                    if(workout.type === 'cycling'){
                        html += `
                        <div class="workout__details">
                            <span class="workout__icon">📏⏱</span>
                            <span class="workout__value">${workout.speed}</span>
                            <span class="workout__unit">км/ч</span>
                        </div>
                        <div class="workout__details">
                            <span class="workout__icon">🏔</span>
                            <span class="workout__value">${workout.climb}</span>
                            <span class="workout__unit">м</span>
                        </div>
                        </li>
                        `
                    }

                    form.insertAdjacentHTML('afterend', html);

            }
        }

const app = new App();













