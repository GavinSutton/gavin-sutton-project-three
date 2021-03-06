const myApp = {}

    // Typed.js for landing page aesthetics
    let typed = new Typed('.type', {
        strings: [
            'Stop the bad guy. ^1000',
            'Save the world. ^1000',
        ],
        smartBackspace: true,
        typeSpeed: 30,
        backSpeed: 22,
        loop: true  // Default value
    });

    // The default user/cpu health, shown in hearts on the game field. 
    let userHealth = 3; 
    let cpuHealth = 3;

    // userHealthFunction calculates the amount of hearts the user has
    myApp.userHealthFunction = function() {
        if ( userHealth === 2) {
            $(`.user-heart-3`).removeClass(`fas`).addClass(`far`)
        }
        if (userHealth === 1) {
            $(`.user-heart-2`).removeClass(`fas`).addClass(`far`)
        }

        if (userHealth === 0 && cpuHealth === 0) {
            $(`.user-heart-1`).removeClass(`fas`).addClass(`far`)
            alert(`Tie Game`)
        }
        
        if (userHealth === 0) {
            $(`.user-heart-1`).removeClass(`fas`).addClass(`far`)
            $(`.game-field`).addClass(`black-background`).html(
                `<div class="play-again">
                <h2>You Lost!</h2>
                <a href=""><p>Play again?</p></a>
            </div>`
            )
        }
    }

    // cpuHealthFunction lowers the health of the computer when shot, and alerts the user when they have won
    myApp.cpuHealthFunction = function() {
        if (cpuHealth === 2) {
            $(`.cpu-heart-3`).removeClass(`fas`).addClass(`far`)
        }
        if (cpuHealth === 1) {
            $(`.cpu-heart-2`).removeClass(`fas`).addClass(`far`)
        }

        if (cpuHealth === 0 && userHealth >=1) {
            $(`.cpu-heart-1`).removeClass(`fas`).addClass(`far`)
            $(`.game-field`).html(`<video autoplay src="assets/you-win.mp4"></video>`).addClass(`black-background`)
            setTimeout(function (){
                $(`.game-field`).addClass(`black-background`).html(
                `<div class="play-again">
                    <h2>You Won!</h2>
                    <a href=""><p>Play again?</p></a>
                </div>`
                )
            }, 5000);
            
        }
    }


    // The default user/cpu computerAmmo, shown in the ammo section
    let userAmmo = 1;
    let computerAmmo = 1;

    // userAmmoFunction adds one amunition for every "reload" while subtracting one amunition for every "shoot"
    myApp.userAmmoFunction = function(choice) {
        const userChoice = $(choice).attr(`id`);

        if ( userChoice === `reload` && userChoice !== 'shoot' ) {
            userAmmo = userAmmo + 1;
        } else if ($(choice).attr(`id`) === `shoot` && userAmmo !== 0) {
            userAmmo = userAmmo - 1;
        } 

        $(`.user-ammo-counter`).html(`${userAmmo}`);
    }

    // Randomize function for computer's choice
    const random = function (options) {
        const index = Math.floor(Math.random() * options.length);
        return options[index];
    }

    // the enemy function choses between three badguys to face
    myApp.enemy = function() {
        const enemyOptions = [`enemy-1`, `enemy-2`]
        const enemyChoice = random(enemyOptions);
        $(`.enemy`).html(`
        <img src="assets/${enemyChoice}.png" alt = "Image of your enemy.">
        `)   
    }

    

    // runComputerChoice has a list of the three choices (shoot, block, reload) that uses the randomize function above to chose between. However, if cpu ammo is at 0, the "shoot" option is shift()ed, and the cpu can only block or reload
    myApp.runComputerChoice = function() {
        // list of computer choices
        const computerOptions = [`shoot`, `block`, `reload`];
        if (computerAmmo >= 1) {
            random(computerOptions);
        } else if (computerAmmo == 0) {
            computerOptions.shift();
            random(computerOptions)
        }

        return computerChoice = random(computerOptions);
    }

    // computerAmmoFunction adds ammo if runComputerChoice is "reload", and subtracts ammo if runComputerChoice is "shoot" 
    myApp.computerAmmoFunction = function() {
        if (computerChoice === `reload`) {
            computerAmmo = computerAmmo + 1;
        } else if ( computerChoice === `shoot` && computerAmmo !== 0) {
            computerAmmo = computerAmmo - 1;
        }
        $(`.computer-ammo-counter`).html(`${computerAmmo}`);
    }

    // runUserChoice describes all the scenarios of what the user chooses vs what the cpu choice is, and runs other functions based off of those choices. 
    myApp.runUserChoice = function(choice) {
        const userChoice = $(choice).attr(`id`);
        setTimeout(function () {
            $(`h3.user-results`).text(``);
            $(`h4.user-results`).text(``);
            $(`h3.cpu-results`).text(``);
        }, 1000);

        if (userAmmo == 0 && userChoice === `shoot`) {
            alert(`You need to reload before you can shoot!`)
        } 

        if (userChoice === `shoot` && computerChoice === `shoot` && userAmmo !== 0) {
            $(`h3.user-results`).text(`Tie`);
            $(`h4.user-results`).text(`You shot eachother`);
            userHealth = userHealth - 1;
            myApp.userHealthFunction();
            cpuHealth = cpuHealth - 1;
            myApp.cpuHealthFunction();
        } else if (userChoice === `shoot` && computerChoice === `block` && userAmmo !== 0) {
            $(`h3.user-results`).text(`Shoot:`);
            $(`h4.user-results`).text(`Enemy blocked shot`);
        } else if (userChoice === `shoot` && computerChoice === `reload` && userAmmo !==0) {
            $(`h3.user-results`).text(`Shoot:`);
            $(`h4.user-results`).text(`Enemy was hit`);
            cpuHealth = cpuHealth - 1;
            myApp.cpuHealthFunction();
        } else if (userChoice === `block` && computerChoice === `shoot`) {
            $(`h3.user-results`).text(`Block:`);
            $(`h4.user-results`).text(`You stopped a shot`);
        } else if (userChoice === `reload` && computerChoice === `shoot`) {
            $(`h3.user-results`).text(`Reload:`);
            $(`h4.user-results`).text(`You were hit`);
            userHealth = userHealth - 1;
            myApp.userHealthFunction();
        } else if (userChoice === `reload` && computerChoice !== `shoot`) {
            $(`h3.user-results`).text(`Reload:`);
            $(`h4.user-results`).text(`+1 ammo`);
            // $(`h2.user-results`).text(`Reload: + 1 ammo`);
        } else if (userChoice === `block` && computerChoice !== `shoot`) {
            $(`h3.user-results`).text(`Block`);
        } 
    }

    // runComputerOptions simply displays what the computer chooses so the user knows
    myApp.runComputerOptions = function () {
        if (computerChoice === `reload`) {
            $(`h3.cpu-results`).text(`Reload`);
        } else if (computerChoice === `block`) {
            $(`h3.cpu-results`).text(`Block`); 
        } else if (computerChoice === `shoot`) {
            $(`h3.cpu-results`).text(`Shoot`);
        }
    }

myApp.init = function () {
    // Running the enemy function on page load
    myApp.enemy();

    // This click function activates the game and depending on what is clicked (shoot, reload, block) activates a bunch of other functions. The "this" sends the option to other functions. 
    $(`p.user-choice`).on(`click`, function(e) {
        e.preventDefault();
        myApp.runComputerChoice();
        myApp.computerAmmoFunction(this);
        myApp.runComputerOptions(this);
        myApp.runUserChoice(this);
        myApp.userAmmoFunction(this);
    });

    // This function controls what is displayed on screen. Upon screen load, only the header is displayed, forcing the user to click "accept", which then hides the header and sends the user to the game screen. 
    $(`.accept`).on(`click`, function (e) {
        $(`main`).removeClass(`hide`)
        $(`header`).addClass('hide')
    });

    // This function toggles the info/instructions on how to play. 
    $(`.info`).on(`click`, function (e) {
        $(`.info-popup`).removeClass(`hide`)
    });

    $(`.return`).on(`click`, function (e) {
        $(`.info-popup`).addClass(`hide`)
    });
}

$(document).ready(function () {
    myApp.init();
});