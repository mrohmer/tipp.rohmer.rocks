<script lang="ts">
  import {createEventDispatcher, onMount} from 'svelte';
  import SettingsRow from "./SettingsRow.svelte";
  import {environment} from '../../environments/environment';
  import Switch from "../control/Switch.svelte";

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function requestNotificationPermission(): Promise<boolean> {
    if (status !== 'granted') {
      const state = await Notification.requestPermission();
      return state === 'granted';
    }

    return Promise.resolve(true);
  }

  async function getSubscription() {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(environment.push.publicKey),
    });
  }

  async function toggleNotification() {
    console.log(enabled)
    requestingPermission = true;
    if (enabled) {
      enabled = await requestNotificationPermission();

      if (enabled) {
        try {
          const subscription = await getSubscription();
          dispatch('enable', subscription);
        } catch (e) {
          enabled = false;
          supported = false;
          console.error(e);
        }
      }
    } else {
      let subscription: any;
      if (status === 'granted') {
        try {
          subscription = await getSubscription();
        } catch (e) {
          console.error(e);
        }
      }
      dispatch('disable', subscription);
    }

    requestingPermission = false;
  }

  let requestingPermission = false;
  let supported = false;
  let status: 'granted' | 'prompt' | 'denied';
  let error = false;
  export let enabled = false;

  const dispatch = createEventDispatcher();

  onMount(() => {
    supported = typeof window !== 'undefined' && 'Notification' in window && !!navigator.serviceWorker;
    if (supported) {
      navigator.permissions.query({name: 'notifications'}).then(function (permissionStatus) {
        status = permissionStatus.state;
        permissionStatus.onchange = function () {
          status = this.state;
        };
      });
    }
  })
</script>

<SettingsRow id="control-notification" type="toggle">
    <span slot="title">
        Benachrichtigungen
    </span>
    <div slot="control">
        <Switch bind:checked={enabled} on:change={() => toggleNotification()} id="control-notification" disabled="{status === 'denied' || !supported}" />
    </div>
</SettingsRow>
