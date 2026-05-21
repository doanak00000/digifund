$(window).on('load', function(){

	"use strict";
 
	
	/* ========================================================== */
	/*   Hide Responsive Navigation On-Click                      */
	/* ========================================================== */
	
	  $(".navbar-nav li a").on('click', function(event) {
	    $(".navbar-collapse").collapse('hide');
	  });

	
	/* ========================================================== */
	/*   Navigation Color                                         */
	/* ========================================================== */
	
	$('#navbarCollapse').onePageNav({
		filter: ':not(.external)'
	});


	/* ========================================================== */
	/*   SmoothScroll                                             */
	/* ========================================================== */
	
	$(".navbar-nav li a, a.scrool").on('click', function(e) {
		
		var full_url = this.href;
		var parts = full_url.split("#");
		var trgt = parts[1];
		var target_offset = $("#"+trgt).offset();
		var target_top = target_offset.top;
		
		$('html,body').animate({scrollTop:target_top -70}, 1000);
			return false;
		
	});


	/* ========================================================== */
	/*   Newsletter (EmailJS)                                     */
	/* ========================================================== */
	$('.newsletter-form').each( function(){
		var form = $(this);
		form.submit(function(e) {
			e.preventDefault();
			var email = $('input[name="nf_email"]', form).val();
			if (!email) return;
			// Replace the following IDs with your EmailJS values
		emailjs.send('YOUR_EMAILJS_SERVICE_ID','YOUR_NEWSLETTER_TEMPLATE_ID',{ email: email })
		.then(function(){
			form.fadeOut('fast', function() {
				$(this).siblings('p.newsletter_success_box').show();
			});
		}, function(err){
			alert('Gửi thất bại, vui lòng thử lại sau.');
		});
		});
	});
	

	/* ========================================================== */
	/*   Register                                                 */
	/* ========================================================== */
	
	$('#register-form').each( function(){
		var form = $(this);
		//form.validate();
		form.submit(function(e) {
			if (!e.isDefaultPrevented()) {
				jQuery.post(this.action,{
					'names':$('input[name="register_names"]').val(),
					'phone':$('input[name="register_phone"]').val(),
					'email':$('input[name="register_email"]').val(),
					'ticket':$('select[name="register_ticket"]').val(),
				},function(data){
					form.fadeOut('fast', function() {
						$(this).siblings('p.register_success_box').show();
					});
				});
				e.preventDefault();
			}
		});
	})
	
	
	/* ========================================================== */
	/*   Contact (EmailJS)                                        */
	/* ========================================================== */
	$('#contact-form').each( function(){
		var form = $(this);
		form.submit(function(e) {
			e.preventDefault();
			var name = $('input[name="contact_name"]', form).val();
			var phone = $('input[name="contact_phone"]', form).val();
			var message = $('textarea[name="contact_message"]', form).val();
			// Replace with your EmailJS service and template IDs
		emailjs.send('YOUR_EMAILJS_SERVICE_ID','YOUR_CONTACT_TEMPLATE_ID',{
			from_name: name,
			phone: phone,
			message: message
		})
		.then(function(){
			form.fadeOut('fast', function() {
				form.siblings('p.contact_success_box').show();
			});
		}, function(err){
			alert('Gửi thất bại, vui lòng thử lại sau.');
		});
		});
	})
});

	/* ========================================================== */
	/*   Popup-Gallery                                            */
	/* ========================================================== */
	$('.popup-gallery').find('a.popup1').magnificPopup({
		type: 'image',
		gallery: {
		  enabled:true
		}
	}); 
	
	$('.popup-gallery').find('a.popup2').magnificPopup({
		type: 'image',
		gallery: {
		  enabled:true
		}
	}); 
 
	$('.popup-gallery').find('a.popup3').magnificPopup({
		type: 'image',
		gallery: {
		  enabled:true
		}
	}); 
 
	$('.popup-gallery').find('a.popup4').magnificPopup({
		type: 'iframe',
		gallery: {
		  enabled:false
		}
	});  
 