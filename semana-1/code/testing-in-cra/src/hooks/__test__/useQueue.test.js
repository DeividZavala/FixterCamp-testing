import { renderHook, act } from "@testing-library/react-hooks";
import useQueue from "../useQueue";

describe("useQueue", () => {
  test("useQueue hook methods", () => {
    const { result } = renderHook(() => useQueue());
    expect(result.current.size()).toBe(0);

    act(() => result.current.add("test"));

    expect(result.current.size()).toBe(1);
    expect(result.current.first()).toBe("test");

    act(() => result.current.remove());

    expect(result.current.size()).toBe(0);

    act(() => {
      result.current.add(1);
      result.current.add(2);
    });

    expect(result.current.size()).toBe(2);
    expect(result.current.last()).toBe(2);
  });
});
