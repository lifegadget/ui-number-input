# `ui-number-input` #

> HTML Number input with Bootstrap and mobile friendly features

An Ember-CLI addon that provides a highly functional extension of Ember's TextInput control with the following additions:

1. Usability Improvements
	- Input type set to 'Number' (this can be set back to 'Text' if there are concerns about not supporting HTML5 input types)
	- Very lightweight CSS which removes unwanted visual spinner controls (see [test app](http://development.ui-number-input.divshot.io/) for visual example)
	- `pattern` attribute set to so that mobile devices start with a numeric keyboard
1. Bootstrap Synergy
	- This control does not require Bootstrap but it plays nicely with it
	- Unless told otherwise, it will add the `form-control` class to the input control (making the Bootstrap CSS kick in)
	- It also provides a handy `size` property which allows a simpler interface to the standard Bootstrap CSS sizing
1. Status Rules
	- You can set statically, or bind a string or function() to the `status` property and the appropriate CSS will be applied
	- Basic formatting can be turned on to visually indicate these styles, or you can style them yourself with all your CSS prowess
1. Auto Correction Rules
	- Default rule enforces that only numbers can be input into field
	- Container can opt to add in auto-corrections for *min* and *max* value, as well as enforcing the `step` interval 

## Installation

* change directories to your project folder
* `ember install:addon ui-number-input`

That's it, you're ready to use it.

> Note: before version 0.1.5 of Ember CLI the recommended installation command was: `npm install ui-number-input --save-dev` which should still work for now 
> (although in future builds we may utilise some of the initialisation features that the new syntax opens up)

## Usage ##

See the [Test Demo](http://development.ui-number-input.divshot.io/) for a fairly complete set of examples of how to use the control.

## Repo Contribution

We're open to your creative suggestions but please move past the "idea" stage and send us a PR so we can incorporate your ideas without killing ourselves. :)

## Dependencies ##

There are no external Bower dependencies, however, in order to provide reuse to other form components, the `ui-number-input` leverages a few mixins that also used by companion addons (`ui-text-input` as an example of a addon that uses the same addons). If just planning on using the component then you don't need to concern yourself with this but if you want to extend this or create a PR this is meant to serve as context:

- `InputStatusMixin`
	manages all the functionality around *status* rules and styling. This mixin has the following dependencies:
	
	- `classNameBindings` - expects to have 'statusClass' and 'statusVisualze' listed in the bindings array
	- `status`, `statusIsDefault`, `statusVisualize` become reserved names
- `InputCorrectionMixin`
	Adds *auto-correction* rules functionality

	- `defaultCorrectionRules` will be blank unless the implementing component sets this themselves (blank may be the desired state)
	- `correctionRules` is exposed as a property so that rules can be added by containing view at run time

- `InputAnimationMixin`
- `UiEventListenerMixin`

All of these mixins are currently reside within this addon but will be moved to an external addon dependency in the next release called `ui-form-mixins`.


## Licensing

This component is free to use under the MIT license:

Copyright (c) 2014 LifeGadget Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.