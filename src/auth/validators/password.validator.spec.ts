import { IsPassword } from './password.validator';
import { validate } from 'class-validator';

describe('isPassword validator', () => {
  class TestDto {
    @IsPassword()
    password: string;
  }

  const testDto = new TestDto();
  it('returns no error when value is valid password', async () => {
    testDto.password = 'Pass@123';

    const errors = await validate(testDto);

    expect(errors.length).toBeFalsy();
  });

  it('returns error when value has is shorter than 8 characters', async () => {
    testDto.password = 'Pass@12';

    const errors = await validate(testDto);

    expect(errors.length).toBeTruthy();
  });

  it('returns error when value has no 1 upper case character', async () => {
    testDto.password = 'pass@12';

    const errors = await validate(testDto);

    expect(errors.length).toBeTruthy();
  });

  it('returns error when value has no 1 lower case character', async () => {
    testDto.password = 'PASS@12';

    const errors = await validate(testDto);

    expect(errors.length).toBeTruthy();
  });

  it('returns error when value has no 1 non-alphanumeric character', async () => {
    testDto.password = 'Pass1234';

    const errors = await validate(testDto);

    expect(errors.length).toBeTruthy();
  });
});
