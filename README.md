## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

#Confetti setup


    import Confetti from "confetti"
        
    const confetti = ref();
                
    onMounted(() => {
    	const settings = {}
    	const confetti.value = new Confetti({
    		canvasSelector: "#confetti",
    		targetSelector: ".element",
    		...
    	})
    })

#Confetti props
###canvasSelector: string (required)
A string representing the CSS selector for the canvas element on which the confetti animation will be rendered.
###targetSelector: string (optional)
A string representing the CSS selector for the target element. The confetti burst will be positioned relative to this element. Defaults to canvasSelector
###targetX: number (optional)
 A number representing the horizontal position (as a fraction of the target element's width) where the confetti burst will be centered.

**default: 0.5**
 ###targetY: number (optional)
 A number representing the vertical position (as a fraction of the target element's height) where the confetti burst will be centered.
 
 **default: 0.5**
  ###horizontalBurstRange: Array[number, number] (optional)
An array of two numbers specifying the minimum and maximum horizontal velocity of each confetti particle. Used to control the spread of the confetti in the horizontal direction.

 **default: [-10, 10]**
  ###verticalBurstRange: Array[number, number] (optional)
An array of two numbers specifying the minimum and maximum horizontal velocity of each confetti particle. Used to control the spread of the confetti in the vertical direction.

 **default: [0, 10]**
###particleWidth: number or Array[number, number] (optional)
A `NumberOrPair` indicating the width of each confetti particle. It can be a single number or an array of two numbers representing the minimum and maximum width.

 **default: [6, 10]**
###particleHeight: number or Array[number, number] (optional)
A `NumberOrPair` indicating the height of each confetti particle. It can be a single number or an array of two numbers representing the minimum and maximum height.

 **default: [10, 20]**
###confettiCount: number (optional)
A number specifying the total number of confetti particles to be generated in each burst.

 **default: 100**
###gravityConfetti: number (optional)
A number representing the gravitational acceleration affecting the confetti particles. It influences how quickly particles fall.

 **default: 0.2**
###dragConfetti: number (optional)
A number representing the air resistance affecting the confetti particles. It influences how quickly particles slow down.

 **default: 0.03**
###terminalVelocity: number (optional)
A number representing the maximum falling speed of confetti particles. It caps the speed at which particles can fall under gravity.

 **default: 4**
###colors: Array[ { front: '#000', back: "#111" } ] (optional)
An array of `Color` objects. Each `Color` object should have `front` and `back` properties, defining the front and back colors of the confetti particles.

 **default: **
    ```
     [
    		{ front: '#88C940', back: '#71ab30' },
    		{ front: '#FF818F', back: '#af3644' },
    		{ front: '#FF9900', back: '#e08600' },
    		{ front: '#8E436A', back: '#8E436A' },
    ];
    ```
###fps: number (optional)
A number indicating the frames per second at which the confetti animation should be rendered. This helps standardize the animation speed across different devices.

 **default: 4**