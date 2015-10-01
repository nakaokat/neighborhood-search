var ViewModel = function(){
    var self = this;

    // Google Street View
    this.street = ko.observable('shibuya');
    this.city = ko.observable('tokyo');
    this.bgSrc = ko.observable('');

    var getGoogleMapsImage =  function(){
        self.bgSrc('https://maps.googleapis.com/maps/api/streetview?size=960x500&location=' + self.street() + ', ' + self.city() +      '&heading=151.78&pitch=-0.76&key=AIzaSyCvo7SEJ5xjPQO_fivZH-p4oHzXBjz635E');
    };

    this.submitCityStreet = function(){
        var address = this.city() + ", " +  this.street();
        getGoogleMapsImage();
        getNytimes();
        getWikipedia();
        getWikipediaEnglish();
    }

    // New York Times
    this.nytimesHead = ko.observable("New York Times Articles");
    this.articles = ko.observableArray([]);
    var getNytimes = function(){
        var nytimesApiKey = "85fa5e753eb16f300f2c82cbce5c948f:15:62726826";
        var URL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + self.city() +'&page=2&sort=newest&api-key=85fa5e753eb16f300f2c82cbce5c948f:15:62726826';
        $.getJSON(URL, function(data){
            articles = data.response.docs;
            self.nytimesHead(self.nytimesHead() + " " + self.city());
            for (i = 0; i<articles.length; i++){
                self.articles.push(articles[i]);
                //$nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
            }
        }).error(function(e){
            self.nytimesHead("New York Times articles could not be loaded.");
        });
    }

    // Wikipedia
    this.wikipediaArticles = ko.observableArray();
    this.wikipediaEnglishArticles = ko.observableArray();

    var getWikipedia = function(){
        var wikipediaURL = "https://ja.wikipedia.org/w/api.php";
        $.ajax(wikipediaURL, {
            dataType: 'jsonp',
            data: { action: 'query', list: 'search', srsearch: self.city(), format: 'json' },
            success: function(data, textStatus, jqXHR){
                var searchResult = data.query.search;
                for (i = 0; i<searchResult.length; i++){
                    if (i > 5){
                        break;
                    }
                    //var requltURL = 'https://en.wikipedia.org/wiki/' + searchResult[i].title;
                    self.wikipediaArticles.push(searchResult[i]);
                    console.dir(searchResult[i])
                    /*$wikiElem.append(
                        '<li>' + '<a href="' + requltURL + '">' + searchResult[i].title + '</a>' +'</li>'
                    );*/
                }
            }
        });
    }

    var getWikipediaEnglish = function(){
        var wikipediaURL = "https://en.wikipedia.org/w/api.php";
        $.ajax(wikipediaURL, {
            dataType: 'jsonp',
            data: { action: 'query', list: 'search', srsearch: self.city(), format: 'json' },
            success: function(data, textStatus, jqXHR){
                var searchResult = data.query.search;
                for (i = 0; i<searchResult.length; i++){
                    if (i > 5){
                        break;
                    }
                    self.wikipediaEnglishArticles.push(searchResult[i]);
                }
            }
        });
    }


};

ko.applyBindings(new ViewModel());
