<?php
  $id = $_POST['id'];
  $date = $_POST['date'];
  $datadate = $_POST['datadate'];
  $customer = $_POST['customer'] ?? "";
  $customeraddress = $_POST['address'] ?? "";
  $title = $_POST['title'] ?? "";
  $details = $_POST['details'] ?? "";
  $newtotal = $_POST['newtotal'] ?? "";

  $filename = "html/$id.html" ;
  $content  = $_POST['thedata'] ;

  $template = "00.html";
  $dom = new DOMDocument();
  $dom->loadHTMLFile( $template);
  $dom->getElementById('id')->nodeValue = $id;
  $dom->getElementById('customer')->nodeValue = $customer;
  $dom->getElementById('title')->nodeValue = $title;
  $dom->getElementById('date')->nodeValue = $date;
  $dom->getElementById('date')->setAttribute("data-date", $datadate);
  $dom->getElementById('total')->nodeValue = $newtotal;

  // address
  $customeraddress_div = $dom->getElementById('customeraddress');
  setInnerHTML($customeraddress_div, nl2br($customeraddress));
  
  // details
  $details_div = $dom->getElementById('invoicedetails');
  setInnerHTML($details_div,nl2br($details));

  $thead = $dom->getElementById('thead');
  $lines = $dom->createElement('tbody');

  for ($i=0; $i < 4; $i++) { 
    $line = $_POST["line-$i"] ?? "";
    if(isset($line) && $line != ""){
      $tr = $dom->createElement('tr');
      $lineamount = $_POST["lineamount-$i"] ?? "";
      $linequantity = $_POST["linequantity-$i"] ?? "";
      $linetotal = $_POST["linetotal-$i"] ?? "";
      if($linetotal == "" && ($lineamount != "" && $linequantity != "")){
        $linetotal = intval($linequantity) * intval($lineamount);
      }

      $line_td = $dom->createElement("td");
      $line_td->nodeValue = $line;
      $tr->appendChild($line_td);
      $lineamount_td = $dom->createElement("td");
      $lineamount_td->nodeValue = $lineamount;
      $lineamount_td->setAttribute('class','u');
      $tr->appendChild($lineamount_td);
      $linequantity_td = $dom->createElement("td");
      $linequantity_td->nodeValue = $linequantity;
      $linequantity_td->setAttribute('class','q');
      $tr->appendChild($linequantity_td);
      $linetotal_td = $dom->createElement("td");
      $linetotal_td->nodeValue = $linetotal . " €";
      $linetotal_td->setAttribute('class','t');
      $tr->appendChild($linetotal_td);

      $lines->appendChild($tr);
    }
  }
  $thead->after($lines);
  
  $dom->saveHTMLFile($filename);

  echo json_encode(array('status'=>'1'));

  function setInnerHTML($element, $html){
    $fragment = $element->ownerDocument->createDocumentFragment();
    $fragment->appendXML($html);
    $clone = $element->cloneNode(); // Get element copy without children
    $clone->appendChild($fragment);
    $element->parentNode->replaceChild($clone, $element);
  }

?>
