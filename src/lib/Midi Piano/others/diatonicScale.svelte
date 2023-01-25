<script>
let notes = ["C", "D", "E", "F", "G", "A", "B"];

function createGrid() {
  let grid = [];
  for (let i = 0; i < notes.length; i++) {
    let row = [];
    for (let j = 0; j < 8; j++) {
      row.push(notes[(i + j) % 7]);
    }
    grid.push(row);
  }
  return grid;
}

let scaleGrid = createGrid();
</script>

<table>
  {#each scaleGrid as row}
    <tr>
      {#each row as note}
        <td>{note}</td>
      {/each}
    </tr>
  {/each}
</table>
