// ------------------------------------------
// jQuery - on page load
// ------------------------------------------
$(document).ready(function() {

  // Collapse articles toggle
  $(document.body).on('click', '.read', readArticle);


  // Close Peek reader
  $(document.body).on('click', '.close', closeArticle);

  // Click remove button
  $(document.body).on('click', '.remove_bucket_item', removeSelectedItem);

  // Animated bucket
  $("#stage").load('images/peek_bin.svg', svgLoaded);

  // Animated bucket: shadow
  $("#shadowStage").load('images/shadow_bucket.svg', svgLoaded);

  $(document.body).on('mouseover', '.bucket_item', showMoreInfo);
  $(document.body).on('mouseleave', '.bucket_item', hideMoreInfo);
});

function showMoreInfo() {
  $(this).find(".moreInfo").addClass("showMoreInfo");

}

function hideMoreInfo() {
  $(this).find(".moreInfo").removeClass("showMoreInfo");

}

// ------------------------------------------
// Open PEEK to read article
// ------------------------------------------
function readArticle() {

  var article_id = $(this).parents(".bucket_item").attr('data-id');
  var paragraph = $.parseJSON($("#" + article_id).attr('data-paragraph'));
  var link = $("#" + article_id).attr('data-article-link');

  read(paragraph);

  $(".wholeBucket").attr("class", "wholeBucket animated rubberBand");
  $(".article").addClass("animated fadeOutLeft");
  setTimeout( function() {$(".article_container").addClass("peek_article")}, 1000 );
}

// ------------------------------------------
// Close article
// ------------------------------------------
function closeArticle() {
  $(".wholeBucket").attr("class", "wholeBucket");
  $(".article_container").removeClass("peek_article");
  $(".article").removeClass("fadeOutLeft");
  $(".article").addClass("fadeInLeft");
  clearInterval(readerTimer);
}

// ------------------------------------------
// Loads SVG
// ------------------------------------------
function svgLoaded(response) {
  $(this).addClass("svgLoaded");
  if(!response){
    console.log("Error loading SVG!");
  }
}

// ------------------------------------------
// Locates article id from DOM and removes it from bucket
// ------------------------------------------
function removeSelectedItem() {
  var article_id = $(this).parents(".bucket_item").attr("data-id");
  removeItemFromBucket(article_id);

  // NOTIFY DB TO DECREASE POPULARITY ON ARTICLE_ID
  refreshBucket();
}

// ------------------------------------------
// Extract image url given index's
// ------------------------------------------
function extractImageUrl(txt, index) {
  return txt.slice(index[0],index[1]);
}

// ------------------------------------------
// Find the index of image in fullText
// ------------------------------------------
function findImageIndex(txt) {
  var index = [];

  // Get start and end index of some image
  index.push(txt.indexOf("http://media.npr.org/assets/img"));
  index.push(txt.indexOf(".jpg") + 4);

  return index;
}

// ------------------------------------------
// Use square crop image if it exists
// ------------------------------------------
function findSquareImage(img) {
  // If there is a square version, then use it
  for(var i = 0; i < img.crop.length; i++){
    if(img.crop[i].type == "square") {
      return img.crop[i];
    }
  }
  return img;
}



// ------------------------------------------
// Angular
// ------------------------------------------
var peekApp = angular.module('PeekApp', []);

peekApp.controller('PeekCtrl', function($scope, $http, $sce) {
  $scope.articles = [];

  // ------------------------------------------
  // this pulls in the first set of articles REFACTOR!!!
  // ------------------------------------------
  $http.get('http://api.npr.org/query?apiKey=MDEzMzc4NDYyMDEzOTQ3Nzk4NzVjODY2ZA001&startNum=0&numResults=15&requiredAssets=text&format=json')
    .then(function(res){
      //this targets the stories from the NPR JSON list
      $scope.articles = res.data.list.story;
      //loop through each new article
      for(var article in $scope.articles){
        var text = $scope.articles[article].teaser.$text;
        $scope.articles[article].teaser.$text = $sce.trustAsHtml(text);
        for(var j=0; j < $scope.articles[article].text.paragraph.length; j++){
          $scope.articles[article].text.paragraph[j].text = $scope.articles[article].text.paragraph[j].$text;
        }
      }
      //return only 9 articles to the scope
      $scope.articles = $scope.articles.slice(0, 8);
    });

  // var popularity = 0;

  // ------------------------------------------
  // this adds more articles for infinite scroll REFACTOR!!!
  // ------------------------------------------

  pageNum = 0;

  window.addArticles = function() {
  var oldArray = $scope.articles;
  pageNum++;
  articleNum = ((pageNum + 1) * 9);
  $http.get('http://api.npr.org/query?apiKey=MDEzMzc4NDYyMDEzOTQ3Nzk4NzVjODY2ZA001&startNum=' + articleNum + '&numResults=15&requiredAssets=text&format=json')
    .then(function(res){
      //this targets the new stories from the NPR JSON list
      articles = res.data.list.story;
      //loop through each new article
      for(var i=0; i < articles.length; i++){
        //check to see if the id of the new article is in the old array of articles
        var index = oldArray.indexOf(articles[i].id);
        //if the id is in the oldArray remove it from the new articles
        if(index > -1){
          articles[i].splice(index, 1);
        }
        //this makes the teaser text html safe
        var text = articles[i].teaser.$text;
        articles[i].teaser.$text = $sce.trustAsHtml(text);
        for(var j=0; j < articles[i].text.paragraph.length; j++){
          articles[i].text.paragraph[j].text = articles[i].text.paragraph[j].$text;
        }
      }
      //this pushes only 9 articles to the full articles array
      for(var i=0; i < 9; i++){
        $scope.articles.push(articles[i]);
      }
      
    });

  };

  // ------------------------------------------
  // Double click article to add to bucket
  // ------------------------------------------
  $scope.inBucket = function(article) {
    console.log("check if article is in bucket");
    // for(var i = 0; i < bucketArray.length; i++){
    //   console.log(bucketArray[i].id);
    //   console.log(article.id);
    //   if(bucketArray[i].id == article.id)
    //     return true;
    //   else
    //     return false;
    // }
    return false;
  };

  // ------------------------------------------
  // Double click article to add to bucket
  // ------------------------------------------
  $scope.addToBucket = function(article) {
    if(validId(article.id)){
      addItemToBucket(article.id);

      // NOTIFY DB TO INCREASE POPULARITY ON ARTICLE_ID
      refreshBucket();
    }
  };

  // $scope.makePopular = function() {
  //   popularity++;
  //   console.log(popularity);
  // };
});

// ------------------------------------------
// Main image filter
// - searches through APR JSON
// - returns the primary image/square image
// ------------------------------------------
peekApp.filter('getMainImage', function(){
  return function(input){
    
    // If NPR article has images
    if(input.image){
      // Local variables
      var images = input.image;
      var mainImage;

      // Loop through all the images of article
      for(var i = 0; i < images.length; i++){
        // The article has a primary image
        if(images[i].type == "primary") {
          mainImage = findSquareImage(images[i]);
        }
        // No primary image exists, so use the first available image
        if(i === 0) {
          mainImage = findSquareImage(images[i]);
        }
      }
      return mainImage.src;
    }
    // If the NPR doesn't have images, look through the html, use the first image
    else {
      var npr_logo = "http://media.npr.org/chrome/news/npr-home.png";
      // If JSON has fullText, we will use that
      if(input.fullText){
        // Initialize local variables
        var text = input.fullText.$text;
        var image_index = findImageIndex(text);

        // If index's are valid, we found an image, otherwise just use NPR logo
        return (image_index[0] == -1 || image_index[1] == -1) ? npr_logo : extractImageUrl(text, image_index);
      }
      // If JSON doesn't have fullText, use NPR logo
      else {
        return npr_logo;
      }
    }
  };
});

// ------------------------------------------
// Remove all stories listed as:
// - Top Stories
// - linked from sites other than npr.org
// ------------------------------------------
peekApp.filter("removeTopStories", function() {
  return function(input) {
    for(var i = 0; i < input.length; i++){
      if(input[i].title.$text.indexOf("Top Stories:") >= 0){
        input.splice(i,1);
      }
      if(input[i].link[0].$text.indexOf("npr.org") == -1){
        input.splice(i,1);
      }
    }
    return input;
  };
});

