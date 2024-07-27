<script>
  export let item

  console.log(item)
</script>

<div class="col mb-2">
  <div class="card ct-shadow-sm menu-item-box">
    <div class="img-box-loading" style=""></div>
    <div class="card-body">
      <h5 class="card-title">{item.itemName}</h5>
      <p class="card-text">{item.itemPrice} 원</p>
    </div>
  </div>
</div>
