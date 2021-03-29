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
  export async function preload() {
    try {
      const notifications = await getNotifications.call(this);
      return {notifications};
    } catch (e) {
      this.error(e.status, e.message);
    }
  }
</script>

<script lang="ts">
  import NofiticationSetting from "../../components/settings/NofiticationSetting.svelte";

  export let notifications: boolean;

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
</script>



<div class="settings">
    <NofiticationSetting enabled={notifications}
                         on:enable={async ({detail: subscription}) => updateNotificationSubscription(true, subscription)}
                         on:disable={async ({detail: subscription}) => updateNotificationSubscription(false, subscription)} />
</div>

