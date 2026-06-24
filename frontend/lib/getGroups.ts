import { emitter } from './global';
import { GroupDropDownItemProps } from '@/components/groupDropDown/GroupDropDownItem.vue';
export type checkGroupsRequest = {
    extension_uuid: string;
}
export type checkGroupsResponse = {
    groups: GroupDropDownItemProps[];
}

export async function getGroups(query: checkGroupsRequest) {
    let params: checkGroupsRequest = { extension_uuid: query.extension_uuid };
    const response = await fetch('/app/webtexting/get_groups.php?' + new URLSearchParams(params).toString()).then(r => r.json());
    console.log("[getGroups] fetched groups:", response);
    return response;

}


