# AlgoFrame 5.1.2

AlgoFrame is a powerful animation library that allows you to create stunning and interactive animations for your projects. With a wide range of features and easy-to-use APIs, AlgoFrame empowers developers to bring their designs to life.

## Features

- **Highly customizable:** AlgoFrame provides a flexible and intuitive API that allows you to customize every aspect of your animations, including timing, easing, and styling.

- **Rich animation effects:** With AlgoFrame, you can create a variety of animation effects such as fade, slide, rotate, scale, and more. These effects can be combined and sequenced to create complex and dynamic animations.

- **Interactive animations:** AlgoFrame supports user interactions, allowing you to create animations that respond to user input, such as mouse clicks, touch events, or keyboard interactions.

- **Cross-platform compatibility:** AlgoFrame is designed to work seamlessly across different platforms and devices, including web browsers, mobile devices, and desktop applications.

- **Performance optimization:** AlgoFrame is optimized for performance, ensuring smooth and efficient animations even on low-powered devices.

## Installation

You can install AlgoFrame via npm:

    npm install algoframe

or, to insure you're in the correct version

    npm install algoframe@5

## Usage

With AlgoFrame 5 `algoframe@5.1.2` there are a vast variety of posibilities and arrangements to implement thankfully for the advantages of being AlgoFrame highly modular and customizable.

This README provides an overview of the library's methods and animation breakthroughs.

## Methods
# constructor(options: options)
The constructor method initializes the Animate class with the provided options. The options object includes the following properties:

- sequence: The animation sequence to be played.
easing: The easing function to be used for the animation. Defaults to 'linear'.
controls: Additional control options for the animation, such as FPS and loop.
timing: Timing references for the animation, including duration and delay.
finally(callback: () => void)
The finally method sets a callback function to be executed when the animation is completed or stopped. The callback function should not take any arguments.

- break()
The break method stops the animation from progressing further. This can be useful if you want to pause or interrupt the animation.

- precision(value: number)
The precision method sets the precision value for the animation. The precision value determines the level of detail in the animation. A higher precision value results in smoother animations, but may also increase the computational load.

- run(callback?: animationCallback)
The run method starts the animation. It takes an optional callback function that will be called on each animation frame. The callback function should take a single argument, which is an object containing animation statistics.

# Animation Breakthroughs
AlgoFrame introduces several breakthroughs in animation techniques, including:

- Frame-based Animation: AlgoFrame uses a frame-based animation approach, where each frame of the animation is rendered individually. This allows for precise control over the animation and enables smooth transitions between frames.

- Easing Functions: AlgoFrame supports a variety of easing functions, which control the rate of change of the animation over time. Easing functions can be used to create more natural and visually appealing animations.

- Control Options: AlgoFrame provides control options for the animation, such as setting the frames per second (FPS) and enabling looped animations. These options give developers flexibility in customizing the animation behavior.

- Animation Timing: AlgoFrame allows for precise timing control of the animation, including setting the duration and delay. This enables synchronized animations and precise timing effects.

- Animation Callbacks: AlgoFrame supports callback functions that can be executed at specific points during the animation. This allows developers to add custom logic or effects to the animation **IN ANY PLACE, INCLUDING ALL VARIETY OF NESTING KEYFRAMES AND SEQUENCES EACH BY EACH**.

- Smooth Progression: AlgoFrame ensures smooth progression of the animation by calculating the relative progress and applying easing functions. This results in visually pleasing and natural-looking animations.

- Animation Control: AlgoFrame provides methods to control the animation, such as pausing, resuming, and stopping. These methods give developers fine-grained control over the animation playback.

- Performance Optimization: AlgoFrame includes performance optimizations, such as precision control and frame rate management, to ensure smooth and efficient animations even on resource-constrained devices.


## Getting Started

_To run the examples, follow these steps:_

1. Clone this repository to your local machine.
2. Install the required dependencies on **any** environment you choose for your frontend application (Vite, Webpack, Vanilla JS, etc...) by running npm install.
3. Open your JS or TS file where you are going to import `algoframe` and use it.

# Examples:
- Basic Animation
The `basic` animation demonstrates a simple sequence of keyframes that change the value of the ratio property over time. The animation starts at 0, increases to 0.5, and then reaches 1. Once the animation is complete, the callback function console.log('END BASIC') is executed.

    const basic = new Sequence(
    false,
    [
        new valueKeyframe(2222, 0, 'ratio'),
        new valueKeyframe(4444, 0.5, 'ratio'),
        new valueKeyframe(6666, 1, 'ratio'),
    ],
    'linear',                       // The time morph or 'easing' for the Sequence in particular (recommended to leave it in 'linear')
    undefined,                      // A callback for each frame requested in the animation INSIDE the current Sequence
    () => console.log('END BASIC')  // This is the final Callback parameter for the current Sequence (applicable in any nested conditions)
    );

- Nested Animation
The `first` animation demonstrates the usage of nested keyframes. It includes a clone of the basic animation as a keyframe, which allows for more complex animations. The first animation starts with the basic animation at 0, then progresses to 0.5, and finally reaches 1.

    const first = new Sequence(false, [
    new nestedKeyframe(basic.clone(), 0, 'ratio'),
    new nestedKeyframe(basic.clone(), 0.5, 'ratio'),
    new nestedKeyframe(basic.clone(), 1, 'ratio'),
    ]);

- Chained Animation
The `second` animation demonstrates chaining multiple animations together. It includes a clone of the first animation as a keyframe. The second animation starts with the first animation at 0, then progresses to 0.5, and finally reaches 1.

    const second = new Sequence(1000, [
    new nestedKeyframe(first.clone(), 0, 'ratio'),
    new nestedKeyframe(first.clone(), 0.5, 'ratio'),
    new nestedKeyframe(first.clone(), 1, 'ratio'),
    ]);

- Custom Animation
The `aNormalThing` animation demonstrates a custom animation using value keyframes. It changes the value of the ratio property over time. The animation starts at 0, increases to 0.5, and then returns to 1.
## Keyframes

# valueKeyframe
The valueKeyframe class is used to create a keyframe that changes the value of a property over time. This class takes three arguments: the time in milliseconds at which the change should be applied, the new value for the property, and the name of the property.

In this example, a valueKeyframe is created that changes the 'ratio' property to 0.5 at 1000 milliseconds into the animation.

    new valueKeyframe(1000, 0.5, 'ratio');
As you notices, the time can be either 'ratio' or 'miliseconds', each one according to the type you are providing. For example, if you provide a time 'ratio' of .5, it always will start at the half of the animation. However if your animations endures 1000 miliseconds and you put a valueKeyframe of 500 'miliseconds' time option, it will start also in the half **only because** 500 is the half part of 1000.
# nestedKeyframe
The nestedKeyframe class is used to create a keyframe that includes another animation sequence. This allows for complex animations that include other animations. The nestedKeyframe class takes three arguments: the animation sequence to include, the time in milliseconds at which the sequence should start, and the name of the property that the sequence should modify.

    new nestedKeyframe(basic.clone(), 0, 'ratio');

In this example, a nestedKeyframe is created that starts the 'basic' animation sequence at 0 milliseconds into the animation and modifies the 'ratio' property.
## Conclusion
AlgoFrame is a comprehensive animation library that offers a wide range of features and breakthroughs in animation techniques. With its frame-based approach, easing functions, and precise timing control, AlgoFrame empowers developers to create stunning and interactive animations in their web applications.

For detailed usage instructions and examples, please refer to the documentation.

Happy animating with AlgoFrame!


### Extras

## Creating a Custom Sequence Class from the KeyChanger Abstract Class

# Environment Setup
Before you start, make sure you have Node.js and npm installed on your system. Additionally, you will need the TypeScript compiler for better development, which you can install globally with npm:

    npm install -g typescript

# Creating the KeyChanger Abstract Class

Take a look to the implementation of Sequence based on the abstract inheritance of `KeyChanger`