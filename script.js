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
            console.log(position);
    },
        function(){
            alert('Cannot get your coordinates');
        }
    );
    
}









