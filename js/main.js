//I need a global objet to pass to profile.thml
var testTwo = {}
$(window).load(function() {
    /*
                      _       _     _           
                     (_)     | |   | |          
     __   ____ _ _ __ _  __ _| |__ | | ___  ___ 
     \ \ / / _` | '__| |/ _` | '_ \| |/ _ \/ __|
      \ V / (_| | |  | | (_| | |_) | |  __/\__ \
       \_/ \__,_|_|  |_|\__,_|_.__/|_|\___||___/
                                                
                                                
    */
    var page = "home.html";
    var state;
    var menuOpen = false;
    /*
       __                  _   _                 
      / _|                | | (_)                
     | |_ _   _ _ __   ___| |_ _  ___  _ __  ___ 
     |  _| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
     | | | |_| | | | | (__| |_| | (_) | | | \__ \
     |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
                                                 
                                                 
    */
    //do all the things
    function init() {
        getPage(page);
    }
    //check local storage
    function getLocal() {}
    //save to local storage
    function saveLocal() {}
    //check url
    function checkUrl() {
        return window.location.hash;
    }

    function updateUrl(newPage) {
        history.pushState({
            state: newPage
        }, newPage, newPage);
    }
    // Make Ajax call, page is the page you want to call
    function getPage(newPage) {
        // a little check to make sure page arguement is right
        if (newPage.indexOf("#") > -1) {
            newPage = newPage.replace("#", "");
        }
        if (newPage.match(/.html/) === null) {
            newPage = newPage + ".html";
        }
        page = newPage;
        
        animatePageOut();
        //check what page we're on and update the quiz nav
    }
    //perform true false animations and save answers. takes element clicked as arguement
    function quizTrue(x) {
        //check which quiz it is and save answer
        if ($("#quiz-one").length > 0) {
            //savelocal quiz1:false
            testTwo.quizOneAnswer = true;
        } else if ($("#quiz-two").length > 0) {
            testTwo.quizTwoAnswer = true;
            //savelocal quiz1:false
        } else {
            testTwo.quizThreeAnswer = true;
            //savelocal quiz3:false
        }
        //first make list of elements with data attribute true
        var a = x.parent(".quiz-answers");
        a.children(".showAnswer").each(function() {
            var c = $(this).attr("data-true-false");
            //loose typing is probably a bad idea
            if (c === "true") {
                $(this).removeClass("hide");
            } else {
                $(this).addClass("hide");
            }
        });
        a.children(".guess").each(function() {
            var c = $(this).attr("data-true-false");
            //loose typing is probably a bad idea
            if (c === "true") {
                $(this).addClass("you-win");
            } else {
                $(this).addClass("you-lose");
            }
        });
        $(".continue").removeClass("unavailable");
    }

    function quizFalse(x) {
        //check which quiz it is and save answer
        if ($("#quiz-one").length > 0) {
            //savelocal quiz1:false
            testTwo.quizOneAnswer = false;
        } else if ($("#quiz-two").length > 0) {
            testTwo.quizTwoAnswer = false;
            //savelocal quiz1:false
        } else {
            testTwo.quizThreeAnswer = false;
            //savelocal quiz3:false
        }
        //repeat of quiztrue
        var a = x.parent(".quiz-answers");
        a.children(".showAnswer").each(function() {
            var c = $(this).attr("data-true-false");
            if (c === "true") {
                $(this).addClass("hide");
            } else {
                $(this).removeClass("hide");
            }
        });
        a.children(".guess").each(function() {
            var c = $(this).attr("data-true-false");
            //loose typing is probably a bad idea
            if (c === "true") {
                $(this).addClass("you-lose");
            } else {
                $(this).addClass("you-win");
            }
        });
        $(".continue").removeClass("unavailable");
    }

    function animatePageOut() {
        $("#page-container").addClass("page-animate-out");
    }

    function animatePageIn() {
        $("#page-container").addClass("page-animate-in");
    }

    function animationEnd() {
        switch (true) {
            case ($("#page-container").hasClass("page-animate-in")):
                console.log("page-animate-in");
                $("#page-container").removeClass("page-animate-in");
                break;
            case ($("#page-container").hasClass("page-animate-out")):
                console.log("page-animate-out");
                
                $.get(page, function(res) {
                    $("#page-container").html(res);
                }).done(function() {
                    // find a better way to do this.  array of states?
                    var b = "#" + page.replace(".html", "");
                    updateUrl(b);
                    updateQuizNav(page);
                    $("#page-container").removeClass("page-animate-out");
                    animatePageIn();
                });
                break;
            default:
                console.log("default");
                $.get(page, function(res) {
                    $("#page-container").html(res);
                });
        }

        function updateQuizNav(b) {
            switch (b.replace(".html", "")) {
                case "quiz1":
                    $(".quiz-nav-circle").eq(0).addClass("current");
                    break;
                case "quiz2":
                    $(".quiz-nav-circle").eq(1).addClass("current");
                    break;
                case "quiz3":
                    $(".quiz-nav-circle").eq(2).addClass("current");
                    break;
                default:
            }
        }
    }
    /*	
                           _     _ _     _                           
                          | |   | (_)   | |                          
       _____   _____ _ __ | |_  | |_ ___| |_ ___ _ __   ___ _ __ ___ 
      / _ \ \ / / _ \ '_ \| __| | | / __| __/ _ \ '_ \ / _ \ '__/ __|
     |  __/\ V /  __/ | | | |_  | | \__ \ ||  __/ | | |  __/ |  \__ \
      \___| \_/ \___|_| |_|\__| |_|_|___/\__\___|_| |_|\___|_|  |___/
                                                                     
                                                                     
    */
    //once the css animation is finished, trigger ajax call
    $(document).on('webkitAnimationEnd', '#page-container', function(e) {
        if ($(e.target).is('#page-container')) {
            animationEnd();
        }
    });
    //make clicks on <a> do ajax calls instead
    $(document).on("click", 'a', function(e) {
        if (!$(this).hasClass("continue") && !$(this).hasClass("no-ajax")) {
            e.preventDefault();
            //save a href and pass it to getPage()
            var a = $(this).attr("href");
            getPage(a);
        }
    });
    // clicks on answers (should have better selector)
    $(document).on("click", 'div.quiz-answers > div.long-button', function(e) {
        //save "this"
        var a = $(this);
        //check true/false
        var b = $(this).attr("data-true-false");
        if (b === "true") {
            quizTrue(a);
        } else {
            quizFalse(a);
        }
    });
    $(document).on("click", 'div.quiz-answers > a.long-button', function(e) {
        e.preventDefault();
        var a = checkUrl();
        if (a === "#quiz1") {
            getPage("quiz2");
        } else if (a === "#quiz2") {
            getPage("#quiz3");
        } else {
            getPage("profile");
        }
    });
    // pushstate stuff so we can use back button
    window.addEventListener('popstate', function(e) {
        var k;
        //if no saved pushstate
        if (e.state.state === null) {
            k = "home"
        } else {
            //use saved pushstate
            k = e.state.state;
        }
        getPage(k);
    });
    //close menu
    $("#close-modal").click(function() {
        $("#menu-modal").addClass("closed");
        $("#page-container").removeClass("move-left");
        menuOpen = false;
    });
    //open menu
    $("#menu").click(function(e) {
        e.stopPropagation();
        if (menuOpen === true) {
            $("#menu-modal").addClass("closed");
            $("#page-container").removeClass("move-left");
            menuOpen = false;
        } else {
            $("#menu-modal").removeClass("closed");
            $("#page-container").addClass("move-left");
            menuOpen = true;
        }
    });
    //close modal if its its clicked away from
    $(document).on("click", function() {
        if (menuOpen === true) {
            $("#menu-modal").addClass("closed");
            $("#page-container").removeClass("move-left");
            menuOpen = false;
        }
    });
    init();
});