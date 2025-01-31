package infoSupport;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestCode {

    @Test
    public void tes5() {
        Code c = new Code();
        assertEquals(5, c.getFive());
    }

    @Test
    public void test6() {
        Code c = new Code();
        assertEquals(6, c.getSix());
    }
}
