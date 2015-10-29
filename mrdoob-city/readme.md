# Mr. Doob's Procedural City

For more information on this interesting demo, see the following links:

 - http://mrdoob.com/lab/javascript/webgl/city/01/
 - http://learningthreejs.com/blog/2013/08/02/how-to-do-a-procedural-city-in-100lines/

### About

I downloaded a copy of the original demo (from the first link) - to play around with it, and understand it better. I found that it worked ok with its included version of threejs (r59dev) - but when I updated threejs to r73 (the current latest version as of 10/29/2015) - I found things in a broken state, due to changes in the library, which started with r60.

So I set out to fix these issues, so that the demo could continue to amuse and amaze people with the possibilities afforded by threejs and webgl as a whole.

If you load up city_0.1.html - your browser will render a nearly identical version of Mr. Doob's classic, using the r59dev version of threejs.

Conversely, if you load up city_0.2.html - your browser will render the procedural city using the r73 version of threejs.

### Note

If you follow the second link, it gives a step-by-step explanation of how Mr. Doob's procedural city demo works. Note, though, that this explanation is in regard to the original implementation using the r59dev version of threejs. As such, it will not work with the current version of threejs, nor will the presented extension (threex.proceduralcity) work properly. Applying the changes from the 0.2 version of the procedural city from this repo will fix those issues.

