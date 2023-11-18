$(document).ready(function () {

  $('.registr_bl li a').on('click', function(e){
      e.preventDefault();
      if(!$(this).parent().hasClass('active')){
        var ind_li = $(this).parent().index();
        $('.main_tab>div').removeClass('active');
        $('.registr_bl li').removeClass('active');
        $(this).parent().addClass('active');
        $('.main_tab>.tab_item').eq(ind_li).addClass('active');
      }
  })

  $('a.razd_star').on('click', function(e){
    e.preventDefault();
    $(this).parent().parent().toggleClass('choosen');

  })

  $('.keys a.str').on('click', function(e){
    e.preventDefault();
    $(this).toggleClass('active');
  })

  var hei_li = $('.tab_section .nav-tabs .nav-item').height();
  // console.log(hei_li);
  $('.boder').css('top', hei_li-2);

    $('a.star_act').on('click', function(e){
        e.preventDefault();
        $(this).parent().parent().parent().toggleClass('active');
    })

    $('.hamburger').on('click', function(){
        $('header').toggleClass('active');
        $('body').toggleClass('active');
    })

    $('#clear').on('click', function(){
      $('input#region').val('');
    })

    $('.my_carousel').owlCarousel({
        loop: true,
        // center: true,
        nav    : false,
        navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
        stagePadding: 50,
        responsive:{
            0:{
                items:1,
                stagePadding: 20
                // margin: 20
            },
            767:{
                items:2,
                margin: 30,
            },
            1024:{
                items:3,
                margin: 30,
            },
            1600:{
                items:5,
                margin: 30
            }
        }
    });

    //REGIONS POPUP TABLE
  var region = '';
  $('.first-table > ul > li').on('click', function(){
    $('.subregions').toggleClass('opened');
    $('.first-table > ul > li').removeClass('choose');
    $(this).addClass('choose');
    region = $(this).find('a').text();
    $('#region').val(region);
  })
  
  $('.back-to-region').on('click', function(){
    $('.subregions').toggleClass('opened');
  })
  
  $('#minicities > ul > li').on('click', function(){
    region = $(this).find('a').text() + ', ' + region;
    $('#region').val(region);
    $('#minicities > ul > li').removeClass('choose');
    $(this).addClass('choose');
    
    $('.subregions').removeClass('shown');
    $('.subregions').removeClass('opened');
  });
  $('.subregions .along-region').on('click', function(){
    $('#region').val(region);
    $('.subregions').removeClass('shown');
    $('.subregions').removeClass('opened');
  })
  $('.subregions .close-button').on('click', function(){
    $(this).parent().removeClass('shown');
  })
  
  $('.whole-country').on('click', function(){
    $('#region').val($(this).text());
    $('.first-table > ul > li').removeClass('choose');
    $('#minicities > ul > li').removeClass('choose');
    $('.subregions').removeClass('shown');
    $('.subregions').removeClass('opened');
  })
  
  $('#region').focus(function(){
    $('.subregions').addClass('shown');
  });
  
   $('.js-example-basic-single').select2();

  $('.choose_filt').hover(
    function(){
      $(this).addClass('opened');
    },
    function(){
      $(this).removeClass('opened');
    }
  );
  $('.add_izb').on('click', function(e){
    e.preventDefault();
    $(this).toggleClass('active');
  })

            function readURL(input, span, parentElement) {

      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          
          
          span.css({ backgroundImage:  'url('  + e.target.result + ')'});
          
          span.hide();
          span.fadeIn(650);
          parentElement.addClass('uploaded');
        }
        if(input.files[0].size > 2097152){
          alert('Файл слишком большой')
        }else{
          reader.readAsDataURL(input.files[0]);
        }
      }
    }

    $(".uploadPreview input").change(function() {
      
      var span = $(this).parent().find('.img-uploader');
      var remover = $(this).parent().next('.remove-image');
      var parentElement = $(this).parent().parent();
      
      readURL(this, span, parentElement);
      
      remover.on('click', function(){
        $(this).parent().removeClass('uploaded');
        $(this).prev().find('.img-uploader').css({ backgroundImage: 'url("")'});
      });
    });

$('[data-toggle="tooltip"]').tooltip();




  

})
 