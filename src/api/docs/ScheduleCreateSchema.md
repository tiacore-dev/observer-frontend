# ScheduleCreateSchema


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**chat** | **number** |  | [default to undefined]
**prompt** | **string** |  | [default to undefined]
**schedule_type** | **string** |  | [default to undefined]
**interval_hours** | **number** |  | [optional] [default to undefined]
**interval_minutes** | **number** |  | [optional] [default to undefined]
**time_of_day** | **string** |  | [optional] [default to undefined]
**cron_expression** | **string** |  | [optional] [default to undefined]
**run_at** | **string** |  | [optional] [default to undefined]
**company** | **string** |  | [default to undefined]
**target_chats** | **Array&lt;number&gt;** |  | [default to undefined]
**bot** | **number** |  | [default to undefined]
**enabled** | **boolean** |  | [optional] [default to undefined]
**send_strategy** | **string** | fixed — в указанное время, relative — через X минут после анализа | [default to undefined]
**time_to_send** | **string** |  | [optional] [default to undefined]
**send_after_minutes** | **number** |  | [optional] [default to undefined]

## Example

```typescript
import { ScheduleCreateSchema } from './api';

const instance: ScheduleCreateSchema = {
    chat,
    prompt,
    schedule_type,
    interval_hours,
    interval_minutes,
    time_of_day,
    cron_expression,
    run_at,
    company,
    target_chats,
    bot,
    enabled,
    send_strategy,
    time_to_send,
    send_after_minutes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
