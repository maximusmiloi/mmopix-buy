export const clearModal = async(container, excLabel, excSelect) => {
  const selects = container.querySelectorAll('select');
  const labels = container.querySelectorAll('label');
  const inputs = container.querySelectorAll('input');
  const chapetOptions = container.querySelectorAll('.chapter-options');
  
/*         const buttonVariant = modalContainer.querySelectorAll('.chapter-type-button');
    buttonVariant.forEach(button => {  
      button.remove();
    }) */

/*   if(excLabel.length === 0) {
    inputs.forEach(input => {input.remove()});
    return 'true';
  } */
  labels.forEach(label => {
    if(label.id !== excLabel[0] && label.id !== excLabel[1]) {
      label.remove();
    }
  });

  selects.forEach(select => {
    if(select.id !== excSelect[0] && select.id !== excSelect[1]) {
      select.remove();
    }
/*     const hasSelect = excSelect.some(id => id !== select.id)
    if (hasSelect) {
      select.remove();
    } */
  });
  inputs.forEach(input => {input.remove()});
  chapetOptions.forEach(option => option.remove());
  /* divAll.forEach(div => div.remove()) */
  return 'true';
}
