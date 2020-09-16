// grabing dataset
$('.pokedex').on('click', function(e){
    e.preventDefault();
    const id = e.target.dataset.id;
    if(id !== undefined){
    // using logic from submit to advance pages
    $('input[name="input"]').change().val(id);
    $('input[name="input"]').submit();
    }
    else {
        return
    };
});

$('#pokeForm').on('submit', function(e) {
    e.preventDefault();
    var pokeCall = $('input[type=text]').val().replace(' ', '').toLowerCase();
    pokeCall = pokeCall.split(',');
    // getting type list
    $.get('https://pokeapi.co/api/v2/type/',
    function(){
        pokeTypes = Array.prototype.slice.call(arguments);
    })
    .then(function(){
        let pokeTypeArr = [];
        pokeType = pokeTypes[0].results.map(x => x.name);
        pokeTypeArr.push(pokeType.map(x => x));
        pokeTypeArr = pokeTypeArr[0];
        const pokeString = pokeTypeArr.join(' ');
        var includes = pokeCall.map(function(x){
            return pokeString.includes(x);
        })
        var isTrue = includes.every(x => x == true);
        // displaying types
        if (pokeCall == "type"){
            var pokeSplit = pokeString.split(' ');
            function displayTypes(x){
            
                var mapper = x.map(function(x){
                    return `<div class="container poke-list zoom">
                                <div class="row pt-1">
                                    <div class="col poke-list">
                                        <a href="#" data-id="${x}">-<i class="fas fa-step-forward" style=""></i> ${x}</a>    
                                    </div>
                                </div>
                            </div>`    
                });
                listContent = document.getElementById('screen');
                listContent.innerHTML = mapper;
        
            };
            displayTypes(pokeSplit);

        };
        // getting types of pokemon that where asked for.
        if(isTrue == true){
            var selectedTypes = pokeCall.map(function(type){

                return $.ajax({
                    url: 'https://pokeapi.co/api/v2/type/' + type,
                    dataType: 'json',
                    method: 'GET'
                });
            });
            $.when.apply(null, selectedTypes)
                .then(function(){
                    // array of selections
                    var s = Array.prototype.slice.call(arguments);
                    // getting all pokemon from selected types
                    
                    var pokeLists = s.map(function(x){
                           return x.pokemon;
                    });

                    var pokeList = pokeLists[0].map(x => x.pokemon.name)
                    
                    
                    displayTypes(pokeList);
                    
                });

                function displayTypes(x){
                    let i = -1
                    var mapper = x.map(function(x){
                        return `<div class="container pokelist">
                                    <div class="row pt-1">
                                        <div class="col poke-list zoom">
                                            <a href="#" data-id="${x}">-<i class="fas fa-step-forward" style=""></i> ${x}</a>    
                                        </div>
                                    </div>
                                </div>`    
                    });
                    listContent = document.getElementById('screen');
                    listContent.innerHTML = mapper;
                }      

        }
        // requesting pokemon
        if (!isTrue && pokeCall.toString() !== "type" || Number.isInteger(parseInt(pokeCall))) 
        {
            $.get('https://pokeapi.co/api/v2/pokemon/' + pokeCall,
                function(){
                    pokemonInfo = Array.prototype.slice.call(arguments); 
                }
            )
            .then(function (){
            //var pokemonInfo = Array.prototype.slice.call(arguments); 
                
            // url retrival from the pokemon call (flavor text)
            var flavorUrl = pokemonInfo[0].species.url;
            $.get(flavorUrl,  // url
                function (){ 
                    call_2 =  Array.prototype.slice.call(arguments);               
                })
                // checking array for english entry
            .then(function(){
                let i = 0;
                do {
                    i++;  
                }
                while (call_2[0].flavor_text_entries[i].language.name !== 'en');
                    
                    displayPokemon(pokeArray(pokemonInfo, call_2, i));
            });
            });
            //(call 1, call 2, index)
            function pokeArray(x,y,z){
                var flavor = y[0].flavor_text_entries[z].flavor_text;
                var name = x[0].species.name;
                var abil = x[0].abilities.map(x => x.ability.name);
                var id = x[0].id;
                var type = x[0].types.map(x => ' ' + x.type.name);

                function pokeObject(name, id, abilities, type, flavor) {
                    this.name = name;
                    this.id = id;
                    this.abilities = abilities;
                    this.type = type;
                    this.sprite = x[0].sprites.front_default;
                    this.flavor = flavor
                }

                var newPokemon = new pokeObject(name, id, abil, type, flavor);
                return newPokemon
            }
            // pokemon display
            function displayPokemon(x){
                let i = 0;
                let a = x.abilities.map(function(b){
                    i++;
                    return `<p><span id="tag">Ability ${i} : </span> ${b}</p>`
                })
                .join("");

                let displayItems =  
                `<div class="text-center">
                    <div class="">
                        <p class="pt-1" style="font-size: 24px;">${x.name}</p>
                        <img src=${x.sprite} class=""/>                       
                        <p class="text-center"> ${x.flavor}</p>
                        <p><span id="tag">Identification # : </span> ${x.id}</p>
                        <p><span id="tag">Type : </span> ${x.type}</p>
                        ${a}
                    </div>
                </div>`
                const pokemonContent = document.getElementById('screen');
                pokemonContent.innerHTML = displayItems;
            };
        }
        else {
            return console.log('Error');
        };
    });


});  