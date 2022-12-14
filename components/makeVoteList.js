import createElement from "../utils/createElement.js";
import { db } from "../utils/firebase.js";
import route from "../utils/route.js";
import render from "../utils/render.js";
import renderSelectedStoreList from "./renderSelectedStoreList.js";

const makeVoteList = (params) => {
  let selectedStoreList = [];

  window.addEventListener("submit", (e) => {
    if (!e.target.matches("#store-keyword")) return;
    e.preventDefault();

    kakao.setMap.search(e.target.querySelector("#keyword").value);
  });

  window.addEventListener("click", async (e) => {
    if (e.target.closest("#menu_select")) {
      document
        .querySelector("#menu_select")
        .addEventListener("click", ({ target }) => {
          if (
            target.closest("li") &&
            target.closest("li").className.includes("item") &&
            !target.matches(".add-store")
          ) {
            const id = target.closest("li").className.split("-")[1];
            document.querySelector(
              "#store-detail"
            ).innerHTML = `<iframe style="height: 100vh;" src="https://place.map.kakao.com/m/${id}">`;
          }
        });
    }
    if (e.target.matches(".add-store")) {
      const $store = e.target.closest("li");
      const selectedStore = {
        countVote: 0,
        id: $store.className.split("-")[1],
        title: $store.querySelector(".store-name").textContent,
        description: $store.querySelector(".store-description").textContent,
        tel: $store.querySelector(".tel").textContent,
        thumbnails: [...$store.querySelectorAll(".store-image")].map(($store) =>
          $store.style.backgroundImage.slice(4, -1).replace(/"/g, "")
        ),
        x: $store.querySelector(".x").textContent,
        y: $store.querySelector(".y").textContent,
      };

      selectedStoreList = [...selectedStoreList, selectedStore];

      e.target.disabled = true;
      renderSelectedStoreList(selectedStoreList);
    }
  });

  window.addEventListener("click", async (e) => {
    if (e.target.matches(".map-home")) {
      document.querySelector("#menu_voted").style.display = "none";
      document.querySelector("#menu_wrap").style.display = "block";
      document.querySelector(".map-home").classList.add("active");
      document.querySelector(".map-list").classList.remove("active");
    }
    if (e.target.matches(".map-list")) {
      document.querySelector("#menu_voted").style.display = "block";
      document.querySelector("#menu_wrap").style.display = "none";
      document.querySelector(".map-home").classList.remove("active");
      document.querySelector(".map-list").classList.add("active");
    }
    if (e.target.matches(".remove-btn")) {
      selectedStoreList = selectedStoreList.filter(
        (store) => store.id !== e.target.closest("li").id
      );
      renderSelectedStoreList(selectedStoreList);

      const targetId = e.target.closest("li").id;
      const $addStore = document.querySelector(
        `li.item-${targetId} .add-store`
      );
      if ($addStore) $addStore.disabled = false;
    }
    if (e.target.matches(".total-submit-btn")) {
      e.preventDefault();

      if (selectedStoreList.length < 2) {
        window.alert("???????????? 2 ????????? ??????????????????");
        return;
      }

      try {
        const voteItem = await db.collection("votes").doc(params);
        await voteItem.update({
          stores: firebase.firestore.FieldValue.arrayUnion(
            ...selectedStoreList
          ),
        });
        render(route(e));
      } catch (err) {
        console.error(err);
      }
    }
  });
  if (!window.kakao) {
    window.addEventListener("load", () => {
      kakao.maps.load(() => {
        kakao.setMap.insert(document.querySelector("#kakao-map"));
        kakao.setMap.search("????????? ??????");
      });
    });
  }
  return createElement(`
    <div class="map_wrap">
      <ul class="map-sidebar">
        <li><button class="map-home active">?????? ???</button></li>
        <li><button class="map-list">?????? ??????</button></li>
        <li><a href="/home" class="total-submit-btn">?????? ??????</a></li>
      </ul>
      <div id="menu_wrap" style="display: flex">
        <div id="menu_select" class="bg_white">
          <div class="option">
            <div>
              <form id="store-keyword">
                <input type="text" id="keyword" size="15" value="????????? ??????"/>
                <button type="submit"></button>
              </form>
            </div>
          </div>
          <ul id="placesList"></ul>
          <div id="pagination"></div>
        </div>
        <div id="store-detail"></div>
      </div>
      <div id="menu_voted" style="display:none;">
        ????????? ???????????? ????????????. ???????????? ??????????????????.
      </div>
      <div id="kakao-map" ></div>
    </div>
  `);
};

export default makeVoteList;
