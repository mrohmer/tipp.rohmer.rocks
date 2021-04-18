<script context="module" lang="ts">
  async function getNotifications () {
    const res = await this.fetch('/settings/notification');
    const data = await res.json();

    if (res.status === 200) {
      return data.enabled;
    } else {
      throw {status: res.status, message: data.message}
    }
  }
  async function getDisplayName () {
    const res = await this.fetch('/auth/user');
    const data = await res.json();

    if (res.status === 200) {
      return data.displayName;
    } else {
      throw {status: res.status, message: data.message}
    }
  }
  export async function preload() {
    try {
      const notifications = await getNotifications.call(this);
      const displayName = await getDisplayName.call(this);
      return {notifications, displayName};
    } catch (e) {
      this.error(e.status, e.message);
    }
  }
</script>

<script lang="ts">
  import NofiticationSetting from "../../components/settings/NofiticationSetting.svelte";
  import UsernameSetting from "../../components/settings/UsernameSetting.svelte";

  export let notifications: boolean;
  export let displayName: string;

  let loading: Record<string, boolean> = {};

  async function updateNotificationSubscription(enabled: boolean, subscription) {
    try {
      const {enabled: result} = await fetch(`/settings/notification`, {
        method: enabled ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({enabled, subscription}),
      });
      notifications = result;
    } catch (e) {
      console.error(e);
      // double invert hoping the value changes inside the binding
      notifications = !notifications;
      notifications = !notifications;
    }
  }
  async function updateDisplayName(value: string) {
    loading.displayName = true;
    try {
      await fetch(`/settings/display-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({displayName: value}),
      });
    } catch (e) {
      console.error(e);
      displayName = String(displayName);
    } finally {
      loading.displayName = false;
    }
  }
</script>

<style type="text/scss">
  hr {
    border-color: #333;
  }
</style>


<div class="settings">
    <UsernameSetting bind:value="{displayName}" on:submit={({detail}) => updateDisplayName(detail)} loading={'displayName' in loading && loading.displayName}/>
    <hr />
    <NofiticationSetting enabled={notifications}
                         on:enable={async ({detail: subscription}) => updateNotificationSubscription(true, subscription)}
                         on:disable={async ({detail: subscription}) => updateNotificationSubscription(false, subscription)} />
</div>

