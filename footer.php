<?php if(if_group("superadmin")) { ?>
  <br /><br /><br /><a href="githook.php">Check for app updates</a><br />
<?php
}
?>
<script type="text/javascript">
  function updateTimestamps() {
    document.querySelectorAll('.timestamp').forEach((e) => {
      e.textContent = moment.utc(e.dataset.timestamp).fromNow();
    })
  }
$(document).ready(() => {
  updateTimestamps();
  setInterval(updateTimestamps, 10000);
})
</script>

<?php
require_once "resources/footer.php";
