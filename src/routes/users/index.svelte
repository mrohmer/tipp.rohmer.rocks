<script context="module" lang="ts">
  import {User} from '../../models/user';
  import {Group} from '../../models/group';

  type Users = Partial<User & Record<'groups', Group[]>>;

  async function getData(): Promise<{ users: Users[], groups: Group[] }> {
    const res = await this.fetch(`/users.json`);
    const data = await res.json();

    if (res.status === 200) {
      return data;
    } else {
      throw {status: res.status, message: data.message}
    }
  }

  export async function preload(): Promise<{ users: Partial<User & Record<'groups', Group[]>>[], groups: Group[] }> {
    try {
      return getData.call(this);
    } catch (e) {
      this.error(e.status, e.message);
    }
  }
</script>
<script lang="ts">
  import Icon from "../../components/Icon.svelte";

  export let users: Users[];
  export let groups: Group[];

  let groupsLoading: Record<string, boolean> = {};

  const usersInGroup = (group: Group) => {
    return users.filter(user => user.groups.some(g => g.id === group.id))
  }
  const usersNotInGroup = (group: Group) => {
    return users.filter(user => user.groups.every(g => g.id !== group.id))
  }

  const wrapGroupLoading = async (group: Group, func: () => Promise<any>) => {
    try {
      groupsLoading = {
        ...groupsLoading,
        [group.id]: true,
      }

      await func();
    } finally {
      groupsLoading = {
        ...groupsLoading,
        [group.id]: false,
      }
    }
  }
  const reload = async () => {
    const data = await preload.call(window);
    users = data.users;
    groups = data.groups;
  }
  const addUserToGroup = async (group: string, user: string): Promise<void> => {
    await fetch(`/users/${user}/group/${group}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
  const removeUserFromGroup = async (group: string, user: string): Promise<void> => {
    await fetch(`/users/${user}/group/${group}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
  const handleAddToGroupSubmit = async (event, group: Group) => {
    await wrapGroupLoading(group, async () => {
      event.preventDefault();

      await addUserToGroup(group.id, event.target.user.value);
      await reload();
    })
  }
  const handleRemoveFromGroupClick = async (group: Group, user: User) => {
    await wrapGroupLoading(group, async () => {
      event.preventDefault();

      await removeUserFromGroup(group.id, user.foreignId);
      await reload();
    })
  }
</script>

{#each groups as group}
    <div>
        <h3>{group.name}</h3>

        {#if group.id in groupsLoading && groupsLoading[group.id]}
            loading...
        {:else }
            <ul>
                {#each usersInGroup(group) as user}
                    <li>
                        {user.displayName}
                        <button on:click={async () => await handleRemoveFromGroupClick(group, user)}>
                            <Icon>trash</Icon>
                        </button>
                    </li>
                {/each}
            </ul>

            {#if usersNotInGroup(group).length}
                <form on:submit={async event => await handleAddToGroupSubmit(event, group)}>
                    <label for="group-select-{group.id}">Add to group:</label>
                    <select id="group-select-{group.id}" name="user">
                        {#each usersNotInGroup(group) as user}
                            <option value="{user.foreignId}">{user.displayName}</option>
                        {/each}
                    </select>
                    <button>add</button>
                </form>
            {/if}
        {/if}
    </div>
{/each}

