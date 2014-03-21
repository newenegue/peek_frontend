function parseCookies (cookie) {
  var list = {},
      rc = cookie;
  rc && rc.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = unescape(parts.join('='));
  });
  return list.session_id;
}

exports.getBucket = function(db) {
  return function(req, res) {
    var cookie = parseCookies(req.headers.cookie);
    var collection = db.get('buckets');
    cookie = decodeURI(cookie).trim();
    cookie = cookie.substr(3,(cookie.length - 4));
    collection.findById(cookie,function(err, docs){
      res.json('buckets', {
        bucket: docs
      });
    });
  }
}

exports.addBucket = function(db) {
  return function(req, res) {
    var collection = db.get('buckets');
    collection.insert({}, function (err, doc) {
      if (err) {
          res.send("There was a problem adding the information to the database.");
      }
      else {
        var cookie = parseCookies(req.headers.cookie);
        if (cookie === undefined) {
          res.cookie("session_id", doc._id, {maxAge: 2100000000});
          res.end("cookie created");
        }
        else {
          cookie = decodeURI(cookie).trim();
          cookie = cookie.substr(3,(cookie.length - 4));
          res.end("cookie exists = " + cookie);
        }
      }
    });
  }
}

exports.getArticles = function(db) {
  return function(req, res) {
    var collection = db.get('articlebucket');
    var bucketID = parseCookies(req.headers.cookie);
    bucketID = decodeURI(bucketID).trim();
    bucketID = bucketID.substr(3,(bucketID.length - 4));
    console.log("made it into getArticles function");

    collection.find({bucket_id: bucketID},{},function(err, docs){
      if(err){
        console.log("could not find that bucket")
      }
      else {
        console.log("found it " + docs);
      }
    });

  }
}

exports.addArticle = function(db) {
  return function(req, res) {
    var articleID = req.params.id
    var collection = db.get('articles');
    console.log("made it into the addArticle function")
    collection.findById(articleID,function(err, docs){
      //console.log("found the article by id " + docs._id);
      if (!docs) {
        console.log("the article was not able to be found, so lets add one")
        collection.insert({"_id": articleID, "popularity" : 0}, function (err, doc) {
          if (err) {
            console.log("article was not able to be added to the db");
            res.end("could not add article to db");
          }
        } );
      }
      else {
        console.log("thats weird, we somehow found the article");
      }
      //call add join table function
      addArticleToBucket(articleID, req, db);
    });
    console.log(req.params.id);
    res.end(req.params.id);
  }
}


function addArticleToBucket(articleID, req, db) {
  var collection2 = db.get('articlebucket');
  var bucketID = parseCookies(req.headers.cookie);
  bucketID = decodeURI(bucketID).trim();
  bucketID = bucketID.substr(3,(bucketID.length - 4));

  console.log("made it into addArticleToBucket");
  collection2.findOne({bucket_id: bucketID, article_id: articleID},{}, function(err, docs){
    if (!docs) {
      console.log("the relationship was not able to be found, so lets add one")
      collection2.insert({bucket_id: bucketID, article_id: articleID}, function(err, doc) {
        if (err) {
          console.log('could not add relationship')
        }
      });
    }
    else {
      console.log("the relationship already exists");
    }
  });
}

exports.removeArticle = function(db) {
  return function(req, res) {
    var collection = db.get('articlebucket');
    var articleID = req.params.id
    var bucketID = parseCookies(req.headers.cookie);
    bucketID = decodeURI(bucketID).trim();
    bucketID = bucketID.substr(3,(bucketID.length - 4));
    console.log("made it into removeArticle in node's controller");

    collection.remove({bucket_id: bucketID, article_id: articleID}, function(err){
      if(err) {
        console.log("could not remove relationship");
      }
      else {
        console.log("relationship removed")
      }
    }); 
  }
}