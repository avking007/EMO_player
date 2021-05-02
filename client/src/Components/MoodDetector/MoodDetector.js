/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import './MoodDetector.css';

const MoodDetector = ({history}) => {
    const [isLoaded, setisLoaded] = useState(false);
    
    // start face detector
    const startVideo = async () => {
        const videoTag = document.getElementById('detector');
        try {
            if(videoTag){
                navigator.getUserMedia(
                    { video:{}},
                    stream => {
                            videoTag.srcObject = stream;
                            window.localStream = stream ;          
                    },
                    err => console.error(err)
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    // close mood detection once expression is recorded
    const closeVideo = async () =>{
        window.localStream.getVideoTracks()[0].stop();
    };

    // find resultant mood out of all probablitites
    const findMood = (moodProbalbilities) => {
        const expressionsProbablity = moodProbalbilities[0].expressions;
        let finalMood;
        let max = Number.MIN_VALUE;
        for(let mood in expressionsProbablity){
            if(expressionsProbablity[mood] > max){
                finalMood = mood;
                max = expressionsProbablity[mood];
            }
        } 
    // Currently redirecting to testing route.
    // TODO can be changed later to song list page.
    history.push(`/mood/${finalMood}`); 
    }

    // detect expressions 
    const videoListener = async() => {
        const videoTag = document.getElementById('detector'); 
        const wrapper = document.getElementById('face-detector');
        const detections = await faceapi.detectAllFaces(videoTag).withFaceExpressions();                
        if(detections.length === 1){
            // find resultant mood
            findMood(detections);
            closeVideo();
            wrapper.remove(videoTag);
        } 
    };

    // create event Listener for video
    const createListener = () =>{
            const videoTag = document.getElementById('detector');
            if(videoTag){
                videoTag.addEventListener('play',videoListener);
            }
    }
    
    // load all models of face-api
    const loadAllModels = async() =>{
        await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models'),
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
                ])
        setisLoaded(true);
        startVideo();
        createListener();

    }

    useEffect( () => {
        loadAllModels();
    }, []);

    const createVideoTag = () => {
        return (
        <div id="face-detector">
            <video id="detector" width="720" height="560" autoPlay muted/>
        </div>
        )
    }
    return isLoaded && createVideoTag();
}

export default MoodDetector
