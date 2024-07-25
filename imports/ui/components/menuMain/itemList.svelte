<script>
  import ItemLoading from './itemLoading.svelte'
</script>

<div class="row row-cols-4 g-4 pl-3 pr-3 pt-2 pb-4 list-bg-shadow">
  <div class="col mb-2">
    <span class="btn-add-modal-show">
      <div
        class="card menu-add-box h-100 d-flex justify-content-center align-items-center"
      >
        <i class="bx bx-plus bx-md"></i>
      </div>
    </span>
  </div>

  <div class="col mb-2">
    <div class="card ct-shadow-sm menu-item-box">
      <div
        class="img-box"
        style="background-image: url(../images/food_img/pizza_1.jpg);"
      ></div>
      <div class="card-body">
        <h5 class="card-title">Nomal Pizza</h5>
        <p class="card-text">12,000</p>
      </div>
    </div>
  </div>

  <div class="col mb-2">
    <div class="card ct-shadow-sm menu-item-box">
      <div
        class="img-box"
        style="background-image: url(../images/food_img/pizza_2.jpg);"
      ></div>
      <div class="card-body">
        <h5 class="card-title">Nomal Pizza</h5>
        <p class="card-text">12,000</p>
      </div>
    </div>
  </div>

  <div class="col mb-2">
    <div class="card ct-shadow-sm menu-item-box">
      <div
        class="img-box"
        style="background-image: url(../images/food_img/pizza_3.jpg);"
      ></div>
      <div class="card-body">
        <h5 class="card-title">Nomal Pizza</h5>
        <p class="card-text">12,000</p>
      </div>
    </div>
  </div>

  <div class="col mb-2">
    <div class="card ct-shadow-sm menu-item-box">
      <div class="img-box-loading" style=""></div>
      <div class="card-body">
        <h5 class="card-title">Nomal Pizza</h5>
        <p class="card-text">12,000</p>
      </div>
    </div>
  </div>

  <!-- Loading-box start-->
  <ItemLoading />
  <!-- Loading-box end-->
</div>
