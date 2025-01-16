package infoSupport;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestCode {

    @Test
    public void test() {
        Code c = new Code();
        assertEquals(5, c.getFive());
    }
}
