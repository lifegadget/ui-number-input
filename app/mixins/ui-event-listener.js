import Ember from 'ember';

export default Ember.Mixin.create({
	// CONFIGURATION
	_listenResizeEvent: true,
	_listenScrollEvent: false,
	_listenVisibilityEvent: false, // this depends on a selector and event name being setup as there is no general DOM event
	_visibilitySelector: null,
	_visibilityEventName: null,
		
	// LISTENERS
	bindListeners: function() {
		// Resize
		if(this.get('_listenResizeEvent')) {
			var localisedResize = 'resize.%@'.fmt(this.get('elementId'));
			this.$(window).on(localisedResize, Ember.run.bind(this, this.trigger, ['resizeDidHappen']));			
		}
		// Visibility
		if(this.get('_listenVisibilityEvent')) {
			var selectorFunction = this.get('_visibilitySelector');
			var eventName = this.get('_visibilityEventName');
			if(!$selector || !eventName) {
				console.warning('Can\'t setup a visibility event without configuring the target selector ("_visibilitySelector") and event name ("_visibilityEventName"). Either turn off the visibility event listener ("_listenVisibilityEvent: false") or address the aforementioned missing properties.');
			} else {
				var $selector = selectorFunction(this);
				$selector.on(this.get('_visibilityEventName'), Ember.run.bind(this, this.trigger, ['visibilityDidHappen'] ));
			}
		}
		// Scroll
		if(this.get('_listenScrollEvent')) {
			console.warn('You have configured the use of the Scroll Event listener but this has not been implemented yet.');
		}
	}.on('didInsertElement'),
	// CLEANUP
	_unbindListeners: function() {
		// Resize
		if(this.get('_listenResizeEvent')) {
			var localisedResize = 'resize.%@'.fmt(this.get('elementId'));
			this.$(window).off(localisedResize);
		}
		// Visibility
		if(this.get('_listenVisibilityEvent')) {
			// TODO: implement
		}
		// Scroll
	}.on('willDestroyElement'),
	
	// HELPER/STATUS VARIABLES
	_windowWidth: null,
	_windowWidthObserver: function() {
		if(this.get('_listenResizeEvent')) {
			this.set('_windowWidth',  window.innerWidth || document.documentElement.clientWidth);			
		} else {
			this.set('_windowWidth', null);
		}
	}.on('resizeDidHappen', 'didInsertElement'),
	_windowHeight: null,
	_windowHeightObserver: function() {
		if(this.get('_listenResizeEvent')) {
			this.set('_windowHeight',   window.innerHeight || document.documentElement.clientHeight);
		} else {
			this.set('_windowHeight', null);
		}
	}.on('resizeDidHappen','didInsertElement'),
	_componentWidth: null,
	_componentWidthObserver: function() {
		if(this.get('_listenResizeEvent')) {
			this.set('_componentWidth',   this.$().parent().get(0).innerWidth || this.$().parent().get(0).offsetWidth);			
		} else {
			this.set('_componentWidth', null);
		}
	}.on('resizeDidHappen','didInsertElement'),
	_componentHeight: null,
	_componentHeightObserver: function() {
		if(this.get('_listenResizeEvent')) {
			this.set('_componentHeight', this.$().parent().get(0).innerHeight || this.$().parent().get(0).offsetHeight);
		} else {
			this.set('_componentHeight', null);
		}
	}.on('resizeDidHappen', 'didInsertElement'),
});
