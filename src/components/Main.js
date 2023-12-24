import axios from "axios";
import { BASE_URL_API } from "../api/Api";

// FECTH API DARI {BASE-URL}
const Main = async () => {
	try {
		// AMBIL DATA DARI API (BASE-URL)
		const ambilData = await axios.get(BASE_URL_API);
		const hasilData = ambilData.data.results;
		// console.log(hasilData);
		// TAMPUNG SEMUA DATA POKEMON KE DALEM ELEMENT ID ==> "zx__result"
		const zxContainer = document.getElementById("zx__result");
		for (const pokemon of hasilData) {
			// ambil detail pokemon untuk setiap entri dalam daftar
			const hasilData = await axios.get(pokemon.url);
			// AMBIL FUNGSI pokemonCard() buat kirim parameter
			const pokemonCard = creatPokemonCard(hasilData);
			// RENDER HASIL NYA  ID ==> "zx__result"
			zxContainer.appendChild(pokemonCard);
		}
		// event listener untuk handler form pencarian
		const formPencarian = document.getElementById("zx__FormSearch");
		formPencarian.addEventListener("submit", (e) => {
			e.preventDefault();
			filterPokemon();
		});
		// event listener untuk handler button detail kalo di klik kluar modal
		zxContainer.addEventListener("click", (e) => {
			// ambil elemen button detail dengan class ==> "zx__Button"
			const targetButton = e.target.closest(".zx__Button");
			if (targetButton) {
				// ambil data url pokemon dari atribut data-pokemon-url
				const pokemonUrl = targetButton.getAttribute("data-pokemon-url");
				//panggil fungsi displayPokemonDetails() untuk render detail Pokemon
				PokemonDetails(pokemonUrl);
			}
		});
	} catch (err) {
		alert("Error fetching Pokemon data:", err.message);
	}
};

// FUNGSI BUAT WADAH POKEMON CARD
const creatPokemonCard = (hasilData) => {
	const divPokemonCard = document.createElement("div");
	divPokemonCard.classList.add("col-lg-3");
	divPokemonCard.classList.add("col-md-4");
	divPokemonCard.classList.add("col-6");
	// RENDER HASIL DATA KE DALEM CARD
	divPokemonCard.innerHTML = `
   <div class="zx__cardPokemon mb-4">
      <img src="${hasilData.data.sprites.other.dream_world.front_default}" alt="${hasilData.data.name}" />
      <div class="card-body">
         <h6 class="card-title my-3">NickName : ${hasilData.data.name}</h6>
         <div class="zx__BoxButton d-flex justify-content-center align-items-center">
            <button class="btn zx__Button" id="zx__Button" data-bs-toggle="modal" data-bs-target="#zx__MODAL" data-pokemon-url="${hasilData.config.url}">Lihat Detail</button>
         </div>
      </div>
   </div>`;
	return divPokemonCard;
};

// UNTUK MENAMPIKAN DETAIL POKEMON KE DALEM MODAL
const PokemonDetails = async (pokemonUrl) => {
	try {
		const ambilData = await axios.get(pokemonUrl);
		const hasilData = ambilData.data;
		// KEY API {DESKRIPSI, TELOR, GAMBAR}
		const { description, telor, imageUrl } = await getPokemonDescription(pokemonUrl);
		// RENDER HASIL KE MODAL CARD
		const modalBody = document.getElementById("zx__ModalBoddy");
		modalBody.innerHTML = `
      <div class="card">
         <div class="row g-0 d-flex justify-content-between">
            <div class="col-md-5 d-flex justify-content-center align-items-center">
               <img src="${imageUrl}" alt="${hasilData.name}" class="img-fluid p-4" />
            </div>
            <div class="col-md-7">
               <div class="card-body py-3">
                  <h4 class="card-title">NickName : ${hasilData.name}</h4>
                  <h6 class="card-text mb-3">Berat : ${hasilData.weight}kg</h6>
                  <h6 class="card-text mb-3">Tinggi : ${hasilData.height}cm</h6>
                  <h6 class="card-text mb-3">Group-Telor : ${telor}</h6>
                  <h6 class="card-text mb-3">Kemampuan : ${hasilData.abilities[0].ability.name}</h6>
                  <h6 class="card-text mb-3">Deskripsi : ${description}</h6>
               </div>
            </div>
         </div>
      </div>`;
	} catch (err) {
		alert("Error fetching Pokemon details::", err.message);
	}
};

// FUNGSI BUAT AMBIL DATA DETAIL
const getPokemonDescription = async (pokemonUrl) => {
	try {
		const ambilData = await axios.get(pokemonUrl);
		const hasilData = ambilData.data.species.url;
		const speciesResponse = await axios.get(hasilData);
		// AMBIL DESKRIPSI DARI API
		const description = speciesResponse.data.flavor_text_entries.find((entry) => entry.language.name === "en").flavor_text;
		// AMBIL TELOR DARI API SPESIES
		const telor = speciesResponse.data.egg_groups.map((group) => group.name).join(",");
		// AMBIL URL GAMBAR DARI API SPESIES
		const imageUrl = ambilData.data.sprites.other.dream_world.front_default;
		return { description, telor, imageUrl };
	} catch (error) {
		console.error("Error fetching Pokemon description:", error);
		return null;
	}
};

// FUNGSI UNTUK FILTER PENCARIAN BERDASARKAN NAMA POKEMONG
const filterPokemon = async () => {
	// AMBIL ELEMENT INPUTAN
	const inputElement = document.getElementById("Inputan");
	// KONVERSI NILAI INPUT MENJADI HURF KECIL BUAT PEMBANDING
	const filterValue = inputElement.value.toLowerCase();
	// AMBIL ELEMEN ID ==> zx__result
	const zxContainer = document.getElementById("zx__result");
	// KOSONGKAN KONTAINER ID ==> zx__result
	zxContainer.innerHTML = "";
	try {
		// AMBIL DATA DARI API (BASE-URL)
		const ambilData = await axios.get(BASE_URL_API);
		const hasilData = ambilData.data.results;
		let pokemonDetemukan = false;
		// FILTER BERDASARKAN NAMA
		for (const pokemon of hasilData) {
			const pokemonDetails = await axios.get(pokemon.url);
			const pokemonName = pokemonDetails.data.name.toLowerCase();
			// JIKA POKEMON NYA ADA COCOK RENDER KE CARD POKEMON
			if (filterValue === "" || pokemonName.includes(filterValue)) {
				const pokemonCard = creatPokemonCard(pokemonDetails);
				zxContainer.appendChild(pokemonCard);
				pokemonDetemukan = true;
			}
		}
		// JIKA POKEMON NYA NGGA ADA
		if (!pokemonDetemukan) {
			zxContainer.innerHTML = `<h2 class="textEmpety">"POKEMON KOSONG OM . . . !"</h2>`;
		}
	} catch (err) {
		alert("Error fetching Pokemon details:", err.message);
	}
};

export default Main;
