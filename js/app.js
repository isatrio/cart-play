/* Blue Glue */

var apparel = Backbone.Model.extend();
var apparels = Backbone.Collection.extend({
	model: apparel,
    localStorage: new Backbone.LocalStorage('cart'),
});

var cart = new apparels();

var app = Backbone.View.extend({
	el: '#cartplay',
	initialize: function() {
		this.listenTo(cart, 'add', this.totalPrice);
		this.listenTo(cart, 'remove', this.totalPrice);

		cart.fetch();
		if (cart.length != 0) { 
			this.renderShoppingBag();
		} else {
			this.$('#your-item').append('<li>Your shopping bag is empty</li>');
		}
	},
	events: {
		'click .show-popup': 'showPopup', // handle show popup
		'click figure': 'showPopup',
		'click .popup .close': 'closePopup', // handle close popup
		'click .add-to-bag': 'addToBag', // handle add to bag
		'click .remove': 'removeItem',
		'click .show-shopping-bag': 'showShoppingBag',
		'click .close-shopping-bag': 'showShoppingBag'
	},
	totalPrice: function() {
		var total = 0;
		_.each(cart.models, function(data) {
			// console.log(data.attributes.price);
			total = total + parseFloat(data.attributes.totalPrice);
		});
		this.$('.total-price').html('$' + total.toFixed(2) + ' AUD');
		if ( cart.length != 0) {
			this.$('.show-shopping-bag span').html(cart.length).show();
		} else {
			this.$('.show-shopping-bag span').html(0).hide();
		}
	},
	showShoppingBag: function() {
		this.$('.shopping-bag').toggle('slow');
	},
	renderShoppingBag: function() {
		this.$('#your-item').html('');
		_.each(cart.models, function(data) {
			var template = _.template($('#shopping-bag-item').html(), data.attributes);
			this.$('#your-item').append(template);
		});
	},
	showPopup: function(e) {
		// Close opened popup
		this.$('.popup').css('bottom', '-100%');
		
		// Open popup
		$(e.currentTarget).parent().children('.popup').css("bottom", "0");
	},
	closePopup: function() {
		// Close opened popup
		this.$('.popup').css('bottom', '-100%');
	},
	addToBag: function(e) {
		var id = $(e.currentTarget).data('id'); // Get the id of product first

		$(e.currentTarget).parent().parent().css('cursor', 'wait');
		
		// Collect the value from popup
		var colour = $('#colour' + id).val(),
			size = $('#size' + id).val(),
			qty = $('#qty' + id).val(),
			name = $('.product-name' + id).html(),
			price = $('#price' + id).html(),
			totalPrice = Number(qty) * Number(price);

		// Add to local storage
		cart.create({'id_product': id, 'colour': colour, 'size': size, 'qty': qty, 'name': name, 'price': price, 'totalPrice': totalPrice.toFixed(2)});
		
		var alert = $('<div class="alert-success">Added to shopping bag</div>').hide();
		$(e.currentTarget)
			.parent().parent()
			.css('cursor', 'auto')
			.append(alert);
		alert.show('slow', function() {
			setTimeout(function(){
				alert.fadeOut('slow', function() {
					alert.remove();
				});
			}, 2000);
		});
		this.initialize();
	},
	removeItem: function(e) {
		var idDB = $(e.currentTarget).data('id'),
			idProduct = $(e.currentTarget).parent();

		cart.get(idDB).destroy();

		this.$(idProduct).fadeOut('slow', function() {
			this.$(idProduct).remove();
		});

		if (cart.length == 0) {
			var empty = $('<li>Your shopping bag is empty</li>').hide();
			this.$('#your-item').append(empty);
			setTimeout(function(){
				empty.show('slow');
			}, 600);
		}
	}
});

// Init
$(function() {
    "use strict";
    new app();
});
