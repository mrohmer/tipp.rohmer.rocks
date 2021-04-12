<script lang="ts">
  import {Points} from '../models/constants';
</script>

<style type="text/scss">
  @use '../styles/variables' as var;
    .rules {
      margin-bottom: 20px;
      &__header {
        position: relative;
        padding: 0 10px;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: var.$primaryColor;
          width: 1px;
        }
      }
      &__content {
        padding: 10px;
      }

      &--points {
        td, th {
          padding: 3px 5px;
        }
        td {
          text-align: center;
        }

        th:first-child {
          text-align: right;
        }
      }
    }
</style>

<div class="rules">
    <h3 class="rules__header">Tippmodus</h3>
    <div class="rules__content">
        Es wird das <b>genaue Ergebnis nach Verlängerung</b >getippt.<br>
    </div>
</div>

<div class="rules">
    <h3 class="rules__header">Tippzeit</h3>
    <div class="rules__content">
        Die Tippzeit endet mit Beginn des Spiels.<br>
        Ab diesem Zeitpunkt können keine neuen Tipps abgegeben bzw. bestehende verändert werden.
    </div>
</div>

<div class="rules">
    <h3 class="rules__header">Sichtbarkeit von Tipps</h3>
    <div class="rules__content">
        Die Tipps der anderen Spieler sind erst <b>sichtbar nach Ablauf der Tippzeit</b>.
    </div>
</div>

<div class="rules rules--points">
    <h3 class="rules__header">Punktevergabe</h3>
    <div class="rules__content">
        <table>
            <tr>
                <th></th>
                <th>Tendenz</th>
                <th>Tordifferenz</th>
                <th>Ergebnis</th>
            </tr>
            <tr>
                <th>Sieg</th>
                <td>{Points.victory.tendency || '-'}</td>
                <td>{Points.victory.difference || '-'}</td>
                <td>{Points.victory.exact || '-'}</td>
            </tr>
            <tr>
                <th>Unentschieden</th>
                <td>{Points.draw.tendency || '-'}</td>
                <td>{Points.draw.difference || '-'}</td>
                <td>{Points.draw.exact || '-'}</td>
            </tr>
        </table>
    </div>
</div>
