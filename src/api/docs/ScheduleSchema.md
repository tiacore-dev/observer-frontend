# ScheduleSchema


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**schedule_id** | **string** |  | [default to undefined]
**chat** | **number** |  | [default to undefined]
**prompt** | **string** |  | [default to undefined]
**company** | **string** |  | [default to undefined]
**schedule_type** | **string** |  | [default to undefined]
**interval_hours** | **number** |  | [optional] [default to undefined]
**interval_minutes** | **number** |  | [optional] [default to undefined]
**time_of_day** | **string** |  | [optional] [default to undefined]
**cron_expression** | **string** |  | [optional] [default to undefined]
**run_at** | **string** |  | [optional] [default to undefined]
**enabled** | **boolean** |  | [default to undefined]
**last_run_at** | **string** |  | [optional] [default to undefined]
**created_at** | **string** |  | [default to undefined]
**send_strategy** | **string** |  | [default to undefined]
**time_to_send** | **string** |  | [optional] [default to undefined]
**send_after_minutes** | **number** |  | [optional] [default to undefined]
**bot** | **number** |  | [default to undefined]
**target_chats** | **Array&lt;number&gt;** |  | [default to undefined]

## Example

```typescript
import { ScheduleSchema } from './api';

const instance: ScheduleSchema = {
    schedule_id,
    chat,
    prompt,
    company,
    schedule_type,
    interval_hours,
    interval_minutes,
    time_of_day,
    cron_expression,
    run_at,
    enabled,
    last_run_at,
    created_at,
    send_strategy,
    time_to_send,
    send_after_minutes,
    bot,
    target_chats,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
