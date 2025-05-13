# GetApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAccountsApiAccountsAllGet**](#getaccountsapiaccountsallget) | **GET** /api/accounts/all | Получение списка аккаунтов|
|[**getChatsApiChatsAllGet**](#getchatsapichatsallget) | **GET** /api/chats/all | Получение списка чатов|
|[**getPermissionsApiPermissionsAllGet**](#getpermissionsapipermissionsallget) | **GET** /api/permissions/all | Получение списка разрешений (Permissions)|
|[**getUserRolesApiUserRolesAllGet**](#getuserrolesapiuserrolesallget) | **GET** /api/user-roles/all | Получение списка ролей пользователей|

# **getAccountsApiAccountsAllGet**
> AccountListSchema getAccountsApiAccountsAllGet()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

let username: string; //Фильтр по названию чата (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAccountsApiAccountsAllGet(
    username,
    sortBy,
    order,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **username** | [**string**] | Фильтр по названию чата | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**AccountListSchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getChatsApiChatsAllGet**
> ChatListSchema getChatsApiChatsAllGet()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

let chatName: string; //Фильтр по названию бота (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getChatsApiChatsAllGet(
    chatName,
    sortBy,
    order,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatName** | [**string**] | Фильтр по названию бота | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ChatListSchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPermissionsApiPermissionsAllGet**
> PermissionListSchema getPermissionsApiPermissionsAllGet()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

let permissionName: string; //Фильтр по названию роли (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getPermissionsApiPermissionsAllGet(
    permissionName,
    sortBy,
    order,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permissionName** | [**string**] | Фильтр по названию роли | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**PermissionListSchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserRolesApiUserRolesAllGet**
> UserRoleListSchema getUserRolesApiUserRolesAllGet()


### Example

```typescript
import {
    GetApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GetApi(configuration);

let roleName: string; //Фильтр по названию чата (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getUserRolesApiUserRolesAllGet(
    roleName,
    sortBy,
    order,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleName** | [**string**] | Фильтр по названию чата | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**UserRoleListSchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

