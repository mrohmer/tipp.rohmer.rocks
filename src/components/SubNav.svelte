<style type="text/scss">
  @use "../styles/variables" as var;

  nav.subnav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;
    background: #1B1B1B;
    color: #bbb;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;

    ul {
      margin: 0;
      padding: 0;

      &::after {
        content: '';
        display: block;
        clear: both;
      }
    }
  }

  :global(nav.subnav ul li) {
    display: block;
    float: left;
  }

  :global(nav.subnav ul li a) {
    text-decoration: none;
    padding: 0.5em 0.5em;
    display: block;

  }

  :global(nav.subnav ul li a[aria-current]) {
    position: relative;
    display: inline-block;
  }

  :global(nav.subnav ul li a[aria-current]::after) {
    opacity: 0.6;
    position: absolute;
    content: '';
    width: calc(100% - 1em);
    height: 2px;
    background-color: var.$primaryColor;
    display: block;
    bottom: -1px;
  }

  .subnav-spacer {
    margin-top: 41px;
  }
</style>

<nav class="subnav">
    <ul>
        <slot></slot>
    </ul>
</nav>
<div class="subnav-spacer"></div>
