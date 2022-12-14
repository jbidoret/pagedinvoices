<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PagedInvoices</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/index.css">
  <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
<?php 
  $re = '~\b\d{4}\b\+?~';

  $invoicesByYear = [];

  $all_invoices = glob('html/*.{html}',GLOB_BRACE);
  
  foreach($all_invoices as $file){
    
    $dom = new DOMDocument();
    $dom->loadHTMLFile( $file);
    $id = $dom->getElementById('id')->textContent;
    $total =  intval($dom->getElementById('total')->textContent);
    $customer =  $dom->getElementById('customer')->textContent;
    $details =  $dom->getElementById('details')->textContent;
    $date =  $dom->getElementById('date')->textContent;
    $format_date = $dom->getElementById('date')->getAttribute("data-date");
    $format_date = strtotime( str_replace('/', '-', $format_date ) );
    $dateTime = date('d/m', $format_date );
    $dateMonth = date('m', $format_date );

    if (preg_match($re, $date, $match)) {
      $newyear = $match[0];
    } 

    $invoicesByYear[$newyear] []= [
      'year' => $newyear,
      'date' => $dateTime,
      'month' => $dateMonth,
      'id' => $id,
      'customer' => $customer,
      'details' => $details,
      'file' => $file,
      'total' => $total
    ];
  }  
  krsort($invoicesByYear);

  foreach($invoicesByYear as $year => $invoices){
    echo "<h2>$year</h2>\n<table><tbody>";
    foreach($invoices as $invoice){
      echo "<tr class='tr' data-month='" . $invoice['month'] . "'><td><a href='" . $invoice['file'] . "'>" . $invoice['id'] . "</a></td><td>" . $invoice['date'] . "</td><td>" . $invoice['customer'] . "</td><td>" . $invoice['details'] . "</td><td class='total'>" . $invoice['total'] ." € </td></tr>";
    }
    echo "</tbody><tfoot><tr><td>TOTAL</td><td></td><td></td><td></td><td id='total'></td></tr></tfoot></table>";
  }

  if(count($all_invoices) == 0){
    echo "<h2>" . date('Y') . "</h2><table><tbody><tr class='tr' data-month='0'><td></td><td></td><td></td><td></td><td class='total'>0 € </td></tr></tbody><tfoot><tr><td>TOTAL</td><td></td><td></td><td></td><td id='total'></td></tr></tfoot></table>";
  }
?>

  <button id="create">+</button>

  <div id="new">
    <h2>Nouvelle facture</h2>
    <form action="create.php" method="post" id="form">
      <input type="hidden" name="id" id="id">
      <input type="hidden" name="date" id="date">
      <input type="hidden" name="datadate" id="datadate">
      <input type="hidden" name="newtotal" id="newtotal">
      <p>
        <label for="customer">Client</label>
        <input type="text" name="customer" id="customer">
      </p>
      <p>
        <label for="address">Adresse</label>
        <textarea name="address" id="address"></textarea>
      </p>
      <p>
        <label for="title">Titre</label>
        <input type="text" name="title" id="title">
      </p>
      <p>
        <label for="details">Détails</label>
        <textarea name="details" id="details"></textarea>
      </p>
      <p class="labels">
        <label for="line-0">Desc.</label>
        <label for="lineamount-0">P.U.</label>
        <label for="linequantity-0">Q.</label>
        <label for="linetotal-0">T.</label>
      </p>
      <div class="lines">
        <p class="line">
          <input type="text" class="desc" name="line-0" id="line-0">
          <input type="text" class="amount" name="lineamount-0" id="lineamount-0">
          <input type="text" class="quantity" name="linequantity-0" id="linequantity-0">
          <input type="text" class="total" name="linetotal-0" id="linetotal-0">
        </p>
      </div>
      <p>
        <strong>Total : <span id="newtotaldisplay"></span></strong>
        <span>
          <button type="submit" id="submit">OK</button>
          <button type="cancel" id="cancel">×</button>
        </span>
      </p>
    </form>
  </div>

  <script src="js/index.js"></script>
</body>
</html>