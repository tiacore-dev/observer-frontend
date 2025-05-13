# SchedulesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createScheduleApiSchedulesAddPost**](#createscheduleapischedulesaddpost) | **POST** /api/schedules/add | Create Schedule|
|[**deleteScheduleApiSchedulesScheduleIdDelete**](#deletescheduleapischedulesscheduleiddelete) | **DELETE** /api/schedules/{schedule_id} | Delete Schedule|
|[**editScheduleApiSchedulesScheduleIdPatch**](#editscheduleapischedulesscheduleidpatch) | **PATCH** /api/schedules/{schedule_id} | Edit Schedule|
|[**getScheduleApiSchedulesScheduleIdGet**](#getscheduleapischedulesscheduleidget) | **GET** /api/schedules/{schedule_id} | Get Schedule|
|[**getSchedulesApiSchedulesAllGet**](#getschedulesapischedulesallget) | **GET** /api/schedules/all | Получение списка расписаний с фильтрацией|
|[**toggleScheduleApiSchedulesScheduleIdTogglePatch**](#togglescheduleapischedulesscheduleidtogglepatch) | **PATCH** /api/schedules/{schedule_id}/toggle | Toggle Schedule|

# **createScheduleApiSchedulesAddPost**
> ScheduleResponseSchema createScheduleApiSchedulesAddPost(scheduleCreateSchema)


### Example

```typescript
import {
    SchedulesApi,
    Configuration,
    ScheduleCreateSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let scheduleCreateSchema: ScheduleCreateSchema; //

const { status, data } = await apiInstance.createScheduleApiSchedulesAddPost(
    scheduleCreateSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleCreateSchema** | **ScheduleCreateSchema**|  | |


### Return type

**ScheduleResponseSchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteScheduleApiSchedulesScheduleIdDelete**
> deleteScheduleApiSchedulesScheduleIdDelete()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let scheduleId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteScheduleApiSchedulesScheduleIdDelete(
    scheduleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **editScheduleApiSchedulesScheduleIdPatch**
> ScheduleResponseSchema editScheduleApiSchedulesScheduleIdPatch(scheduleEditSchema)


### Example

```typescript
import {
    SchedulesApi,
    Configuration,
    ScheduleEditSchema
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let scheduleId: string; // (default to undefined)
let scheduleEditSchema: ScheduleEditSchema; //

const { status, data } = await apiInstance.editScheduleApiSchedulesScheduleIdPatch(
    scheduleId,
    scheduleEditSchema
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleEditSchema** | **ScheduleEditSchema**|  | |
| **scheduleId** | [**string**] |  | defaults to undefined|


### Return type

**ScheduleResponseSchema**

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getScheduleApiSchedulesScheduleIdGet**
> ScheduleSchema getScheduleApiSchedulesScheduleIdGet()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let scheduleId: string; // (default to undefined)

const { status, data } = await apiInstance.getScheduleApiSchedulesScheduleIdGet(
    scheduleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleId** | [**string**] |  | defaults to undefined|


### Return type

**ScheduleSchema**

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

# **getSchedulesApiSchedulesAllGet**
> ScheduleListSchema getSchedulesApiSchedulesAllGet()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let search: string; //Фильтр по названию промпта (optional) (default to undefined)
let company: string; // (optional) (default to undefined)
let chat: string; // (optional) (default to undefined)
let scheduleType: string; // (optional) (default to undefined)
let enabled: boolean; // (optional) (default to undefined)
let sortBy: string; //Поле сортировки (optional) (default to undefined)
let order: string; //asc / desc (optional) (default to undefined)
let page: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getSchedulesApiSchedulesAllGet(
    search,
    company,
    chat,
    scheduleType,
    enabled,
    sortBy,
    order,
    page,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **search** | [**string**] | Фильтр по названию промпта | (optional) defaults to undefined|
| **company** | [**string**] |  | (optional) defaults to undefined|
| **chat** | [**string**] |  | (optional) defaults to undefined|
| **scheduleType** | [**string**] |  | (optional) defaults to undefined|
| **enabled** | [**boolean**] |  | (optional) defaults to undefined|
| **sortBy** | [**string**] | Поле сортировки | (optional) defaults to undefined|
| **order** | [**string**] | asc / desc | (optional) defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ScheduleListSchema**

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

# **toggleScheduleApiSchedulesScheduleIdTogglePatch**
> toggleScheduleApiSchedulesScheduleIdTogglePatch()


### Example

```typescript
import {
    SchedulesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SchedulesApi(configuration);

let scheduleId: string; // (default to undefined)

const { status, data } = await apiInstance.toggleScheduleApiSchedulesScheduleIdTogglePatch(
    scheduleId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **scheduleId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[HTTPBearer](../README.md#HTTPBearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

